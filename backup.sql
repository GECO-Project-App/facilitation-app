

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


ALTER TYPE "public"."profile_response" OWNER TO "supabase_admin";


CREATE TYPE "public"."team_role" AS ENUM (
    'member',
    'facilitator'
);


ALTER TYPE "public"."team_role" OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams
    WHERE id = team_id AND created_by = user_id
  ) OR EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = team_id AND user_id = user_id AND role = 'facilitator'
  );
END;
$$;


ALTER FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."generate_team_code"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    code text;
    code_exists boolean;
BEGIN
    LOOP
        -- Generate a random 6-character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 6));
        
        -- Check if code already exists
        SELECT EXISTS (
            SELECT 1 FROM teams WHERE team_code = code
        ) INTO code_exists;
        
        -- Exit loop if code is unique
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    RETURN code;
END;
$$;


ALTER FUNCTION "public"."generate_team_code"() OWNER TO "supabase_admin";


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


ALTER FUNCTION "public"."get_my_profile"() OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."handle_new_team"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Set team_code if not provided
    IF NEW.team_code IS NULL THEN
        UPDATE teams 
        SET team_code = upper(substring(md5(random()::text) from 1 for 6))
        WHERE id = NEW.id;
    END IF;

    -- Insert the creator as a facilitator with their profile info
    BEGIN  -- Add exception handling
        INSERT INTO team_members (
            team_id, 
            user_id, 
            role,
            first_name,
            last_name,
            avatar_url
        )
        SELECT 
            NEW.id,
            NEW.created_by,
            'facilitator',
            profiles.first_name,
            profiles.last_name,
            profiles.avatar_url
        FROM profiles
        WHERE profiles.id = NEW.created_by;
    EXCEPTION 
        WHEN unique_violation THEN 
            -- Do nothing if entry already exists
            NULL;
    END;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_team"() OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."handle_team_member"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Insert the creator as a facilitator
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'facilitator');
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_team_member"() OWNER TO "supabase_admin";


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


ALTER FUNCTION "public"."is_username_available"("p_username" "text") OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."join_team_by_code"("team_code_input" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    team_id_var uuid;
BEGIN
    -- Get team id from code
    SELECT id INTO team_id_var
    FROM teams
    WHERE team_code = team_code_input;

    -- If team exists, add member with their profile info
    IF team_id_var IS NOT NULL THEN
        INSERT INTO team_members (
            team_id,
            user_id,
            role,
            first_name,
            last_name,
            avatar_url
        )
        SELECT 
            team_id_var,
            auth.uid(),
            'member',
            p.first_name,
            p.last_name,
            p.avatar_url
        FROM profiles p
        WHERE p.id = auth.uid()
        ON CONFLICT (team_id, user_id) DO NOTHING;
    END IF;

    RETURN team_id_var;
END;
$$;


ALTER FUNCTION "public"."join_team_by_code"("team_code_input" "text") OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."sync_team_member_avatar"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update avatar_url in team_members when a profile is updated
    UPDATE team_members
    SET avatar_url = NEW.avatar_url
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_team_member_avatar"() OWNER TO "supabase_admin";


CREATE OR REPLACE FUNCTION "public"."sync_team_member_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Update all profile fields in team_members when a profile is updated
    UPDATE team_members
    SET 
        first_name = NEW.first_name,
        last_name = NEW.last_name,
        avatar_url = NEW.avatar_url
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_team_member_profile"() OWNER TO "supabase_admin";


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


ALTER FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") OWNER TO "supabase_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "first_name" "text",
    "last_name" "text",
    "avatar_url" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);


ALTER TABLE "public"."profiles" OWNER TO "supabase_admin";


CREATE TABLE IF NOT EXISTS "public"."team_members" (
    "team_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."team_role" DEFAULT 'member'::"public"."team_role",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "avatar_url" "text",
    "first_name" "text",
    "last_name" "text"
);


ALTER TABLE "public"."team_members" OWNER TO "supabase_admin";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "team_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."teams" OWNER TO "supabase_admin";


ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_pkey" PRIMARY KEY ("team_id", "user_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_team_code_key" UNIQUE ("team_code");



CREATE INDEX "idx_team_members_user_team" ON "public"."team_members" USING "btree" ("user_id", "team_id");



CREATE OR REPLACE TRIGGER "on_profile_update" AFTER UPDATE OF "first_name", "last_name", "avatar_url" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_team_member_profile"();



CREATE OR REPLACE TRIGGER "on_team_created" AFTER INSERT ON "public"."teams" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_team"();



CREATE OR REPLACE TRIGGER "on_team_member_created" AFTER INSERT ON "public"."teams" FOR EACH ROW EXECUTE FUNCTION "public"."handle_team_member"();



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_members"
    ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



CREATE POLICY "Insert team members through trigger" ON "public"."team_members" FOR INSERT WITH CHECK (true);



CREATE POLICY "Only facilitators can update roles" ON "public"."team_members" FOR UPDATE USING ((("user_id" = "auth"."uid"()) AND ("role" = 'facilitator'::"public"."team_role")));



CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."team_members" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "team_members_delete_policy" ON "public"."team_members" FOR DELETE USING (((EXISTS ( SELECT 1
   FROM "public"."team_members" "tm"
  WHERE (("tm"."team_id" = "team_members"."team_id") AND ("tm"."user_id" = "auth"."uid"()) AND ("tm"."role" = 'facilitator'::"public"."team_role")))) OR ("user_id" = "auth"."uid"())));



CREATE POLICY "team_members_insert_policy" ON "public"."team_members" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "team_members_select_policy" ON "public"."team_members" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR ("team_id" IN ( SELECT "teams"."id"
   FROM "public"."teams"
  WHERE ("teams"."created_by" = "auth"."uid"())))));



ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "teams_delete_policy" ON "public"."teams" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "teams_insert_policy" ON "public"."teams" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "teams_select_policy" ON "public"."teams" FOR SELECT USING ((("created_by" = "auth"."uid"()) OR ("id" IN ( SELECT "team_members"."team_id"
   FROM "public"."team_members"
  WHERE ("team_members"."user_id" = "auth"."uid"())))));



CREATE PUBLICATION "logflare_pub" WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION "logflare_pub" OWNER TO "supabase_admin";




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






































































































































































































GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "postgres";
GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_team_management_permission"("team_id" "uuid", "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "postgres";
GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_team_code"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "postgres";
GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_team"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_team_member"() TO "postgres";
GRANT ALL ON FUNCTION "public"."handle_team_member"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_team_member"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_team_member"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_username_available"("p_username" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."join_team_by_code"("team_code_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "postgres";
GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_team_member_avatar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_team_member_profile"() TO "postgres";
GRANT ALL ON FUNCTION "public"."sync_team_member_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_team_member_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_team_member_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "postgres";
GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_profile"("p_username" "text", "p_first_name" "text", "p_last_name" "text", "p_avatar_url" "text") TO "service_role";





















GRANT ALL ON TABLE "public"."profiles" TO "postgres";
GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."team_members" TO "postgres";
GRANT ALL ON TABLE "public"."team_members" TO "anon";
GRANT ALL ON TABLE "public"."team_members" TO "authenticated";
GRANT ALL ON TABLE "public"."team_members" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "postgres";
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
