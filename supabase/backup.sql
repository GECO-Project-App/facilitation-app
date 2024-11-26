

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."profile_response" AS (
	"id" "uuid",
	"username" "text",
	"first_name" "text",
	"last_name" "text",
	"avatar_url" "text",
	"updated_at" timestamp with time zone
);


ALTER TYPE "public"."profile_response" OWNER TO "postgres";


CREATE TYPE "public"."team_role" AS ENUM (
    'member',
    'facilitator'
);


ALTER TYPE "public"."team_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = $1
        AND team_members.user_id = $2
        AND team_members.role = 'facilitator'
    );
END;
$_$;


ALTER FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_team_code"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 6-character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 6));
        
        -- Check if code already exists
        SELECT EXISTS (
            SELECT 1 FROM teams WHERE team_code = code
        ) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    RETURN code;
END;
$$;


ALTER FUNCTION "public"."generate_team_code"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_profile"() RETURNS "public"."profile_response"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_profile public.profile_response;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select
    id,
    username,
    first_name,
    last_name,
    avatar_url,
    updated_at
  into v_profile
  from profiles
  where id = auth.uid();

  return v_profile;
end;
$$;


ALTER FUNCTION "public"."get_my_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_team"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    new_team_code TEXT;
    user_profile RECORD;
    code_exists BOOLEAN;
BEGIN
    -- Generate unique team code loop
    LOOP
        new_team_code := upper(substring(encode(gen_random_bytes(3), 'hex') from 1 for 6));
        
        SELECT EXISTS (
            SELECT 1 FROM teams WHERE team_code = new_team_code
        ) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    UPDATE teams 
    SET team_code = new_team_code 
    WHERE id = NEW.id;

    SELECT first_name, last_name, avatar_url 
    INTO user_profile 
    FROM profiles 
    WHERE id = NEW.created_by;

    INSERT INTO team_members (
        team_id,
        user_id,
        role,
        first_name,
        last_name,
        avatar_url,
        profile_name
    ) VALUES (
        NEW.id,
        NEW.created_by,
        'facilitator',
        user_profile.first_name,
        user_profile.last_name,
        user_profile.avatar_url,
        CONCAT(user_profile.first_name, ' ', user_profile.last_name)
    );

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_team"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    default_username TEXT;
BEGIN
    -- Generate a default username from email if not provided
    default_username := COALESCE(
        new.raw_user_meta_data->>'username',
        SPLIT_PART(new.email, '@', 1)
    );

    insert into public.profiles (
        id,
        first_name,
        last_name,
        avatar_url,
        username,
        updated_at
    ) values (
        new.id,
        COALESCE(new.raw_user_meta_data->>'first_name', ''),
        COALESCE(new.raw_user_meta_data->>'last_name', ''),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        default_username,
        now()
    );
    return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_username_available"("p_username" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  return not exists (
    select 1 from profiles
    where username = p_username
    and id != auth.uid()
  );
end;
$$;


ALTER FUNCTION "public"."is_username_available"("p_username" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."join_team_by_code"("team_code_input" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    team_id_var uuid;
BEGIN
    SELECT id INTO team_id_var
    FROM teams
    WHERE team_code = team_code_input;

    IF team_id_var IS NOT NULL THEN
        INSERT INTO team_members (
            team_id,
            user_id,
            role,
            first_name,
            last_name,
            avatar_url,
            profile_name
        )
        SELECT 
            team_id_var,
            auth.uid(),
            'member',
            p.first_name,
            p.last_name,
            p.avatar_url,
            CONCAT(p.first_name, ' ', p.last_name)
        FROM profiles p
        WHERE p.id = auth.uid()
        ON CONFLICT (team_id, user_id) DO NOTHING;
    END IF;

    RETURN team_id_var;
END;
$$;


ALTER FUNCTION "public"."join_team_by_code"("team_code_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_team_permissions"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_permissions;
    RETURN NULL;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."refresh_team_permissions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_profile_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Update all relevant fields in team_members when profile is updated
    UPDATE team_members
    SET 
        first_name = NEW.first_name,
        last_name = NEW.last_name,
        avatar_url = NEW.avatar_url
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_profile_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_team_member_avatar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Only proceed if avatar_url has changed
    IF OLD.avatar_url IS DISTINCT FROM NEW.avatar_url THEN
        UPDATE team_members
        SET avatar_url = NEW.avatar_url
        WHERE user_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_team_member_avatar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_profile"("p_username" "text" DEFAULT NULL::"text", "p_first_name" "text" DEFAULT NULL::"text", "p_last_name" "text" DEFAULT NULL::"text", "p_avatar_url" "text" DEFAULT NULL::"text") RETURNS "public"."profile_response"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_profile public.profile_response;
begin
  -- Check if user is authenticated
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Validate username if provided
  if p_username is not null then
    if length(p_username) < 3 then
      raise exception 'Username must be at least 3 characters long';
    end if;
    
    if not public.is_username_available(p_username) then
      raise exception 'Username is already taken';
    end if;
  end if;

  -- Update profile
  update profiles
  set
    username = coalesce(p_username, username),
    first_name = coalesce(p_first_name, first_name),
    last_name = coalesce(p_last_name, last_name),
    avatar_url = coalesce(p_avatar_url, avatar_url),
    updated_at = now()
  where id = auth.uid()
  returning
    id,
    username,
    first_name,
    last_name,
    avatar_url,
    updated_at
  into v_profile;

  -- Update auth.users metadata
  update auth.users
  set raw_user_meta_data = jsonb_build_object(
    'username', v_profile.username,
    'first_name', v_profile.first_name,
    'last_name', v_profile.last_name,
    'avatar_url', v_profile.avatar_url
  )
  where id = auth.uid();

  return v_profile;
end;
$$;


ALTER FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text" DEFAULT NULL::"text", "p_description" "text" DEFAULT NULL::"text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    updated_member json;
BEGIN
    UPDATE team_members
    SET 
        profile_name = COALESCE(p_profile_name, profile_name),
        description = COALESCE(p_description, description)
    WHERE team_id = p_team_id 
    AND user_id = auth.uid()
    RETURNING to_json(team_members.*) INTO updated_member;
    
    RETURN updated_member;
END;
$$;


ALTER FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE team_members
    SET profile_name = p_profile_name
    WHERE team_id = p_team_id 
    AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "username" "text",
    "first_name" "text",
    "last_name" "text",
    "avatar_url" "text",
    CONSTRAINT "username_length" CHECK ((("username" IS NULL) OR ("char_length"("username") >= 3)))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "team_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."team_role" DEFAULT 'member'::"public"."team_role",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "first_name" "text",
    "last_name" "text",
    "avatar_url" "text",
    "description" character varying(480),
    "profile_name" "text"
);


ALTER TABLE "public"."team_members" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."team_permissions" AS
 SELECT DISTINCT "tm"."team_id",
    "tm"."user_id"
   FROM "public"."team_members" "tm"
  WITH NO DATA;


ALTER TABLE "public"."team_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "team_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("team_id", "user_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_team_code_key" UNIQUE ("team_code");



CREATE INDEX "idx_team_members_user_team" ON "public"."team_members" USING "btree" ("user_id", "team_id");



CREATE INDEX "idx_teams_created_by" ON "public"."teams" USING "btree" ("created_by");



CREATE UNIQUE INDEX "team_permissions_idx" ON "public"."team_permissions" USING "btree" ("team_id", "user_id");



CREATE OR REPLACE TRIGGER "on_team_created" AFTER INSERT ON "public"."teams" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_team"();



CREATE OR REPLACE TRIGGER "refresh_team_permissions_on_member_change" AFTER INSERT OR DELETE OR UPDATE ON "public"."team_members" FOR EACH STATEMENT EXECUTE FUNCTION "public"."refresh_team_permissions"();



CREATE OR REPLACE TRIGGER "sync_profile_changes" AFTER UPDATE OF "first_name", "last_name", "avatar_url" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_profile_changes"();



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



CREATE POLICY "Enable insert for authenticated users" ON "public"."team_members" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "team_members_access_policy" ON "public"."team_members" TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."team_permissions" "tp"
  WHERE (("tp"."team_id" = "team_members"."team_id") AND ("tp"."user_id" = "auth"."uid"()))))));



ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "teams_access_policy" ON "public"."teams" TO "authenticated" USING ((("created_by" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."team_permissions" "tp"
  WHERE (("tp"."team_id" = "teams"."id") AND ("tp"."user_id" = "auth"."uid"())))) OR ("team_code" IS NOT NULL)));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_team_permissions"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_team_permissions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_team_permissions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_profile_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_profile_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_profile_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_team_member_profile"("p_team_id" "uuid", "p_profile_name" "text", "p_description" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_team_member_profile_name"("p_team_id" "uuid", "p_profile_name" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";



GRANT ALL ON TABLE "public"."team_permissions" TO "anon";
GRANT ALL ON TABLE "public"."team_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."team_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
