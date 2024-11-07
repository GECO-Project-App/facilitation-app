create type "public"."team_role" as enum ('member', 'facilitator');

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone,
    "username" text,
    "first_name" text,
    "last_name" text,
    "avatar_url" text
);


alter table "public"."profiles" enable row level security;

create table "public"."team_members" (
    "team_id" uuid not null,
    "user_id" uuid not null,
    "role" team_role default 'member'::team_role,
    "joined_at" timestamp with time zone default now(),
    "avatar_url" text,
    "first_name" text,
    "last_name" text
);


alter table "public"."team_members" enable row level security;

create table "public"."teams" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "team_code" text,
    "created_at" timestamp with time zone default now(),
    "created_by" uuid
);


alter table "public"."teams" enable row level security;

CREATE INDEX idx_team_members_user_team ON public.team_members USING btree (user_id, team_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (team_id, user_id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

CREATE UNIQUE INDEX teams_team_code_key ON public.teams USING btree (team_code);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."team_members" add constraint "team_members_pkey" PRIMARY KEY using index "team_members_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" add constraint "username_length" CHECK ((char_length(username) >= 3)) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."team_members" add constraint "team_members_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."team_members" validate constraint "team_members_team_id_fkey";

alter table "public"."team_members" add constraint "team_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."team_members" validate constraint "team_members_user_id_fkey";

alter table "public"."teams" add constraint "teams_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."teams" validate constraint "teams_created_by_fkey";

alter table "public"."teams" add constraint "teams_team_code_key" UNIQUE using index "teams_team_code_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_team_management_permission(team_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams
    WHERE id = team_id AND created_by = user_id
  ) OR EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = team_id AND user_id = user_id AND role = 'facilitator'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_team_code()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
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
$function$
;

create type "public"."profile_response" as ("id" uuid, "username" text, "first_name" text, "last_name" text, "avatar_url" text, "updated_at" timestamp with time zone);

CREATE OR REPLACE FUNCTION public.get_my_profile()
 RETURNS profile_response
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_team()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_team_member()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Insert the creator as a facilitator
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'facilitator');
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_username_available(p_username text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return not exists (
    select 1 from profiles
    where username = p_username
    and id != auth.uid()
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.join_team_by_code(team_code_input text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.sync_team_member_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update avatar_url in team_members when a profile is updated
    UPDATE team_members
    SET avatar_url = NEW.avatar_url
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_team_member_profile()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_profile(p_username text DEFAULT NULL::text, p_first_name text DEFAULT NULL::text, p_last_name text DEFAULT NULL::text, p_avatar_url text DEFAULT NULL::text)
 RETURNS profile_response
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."team_members" to "anon";

grant insert on table "public"."team_members" to "anon";

grant references on table "public"."team_members" to "anon";

grant select on table "public"."team_members" to "anon";

grant trigger on table "public"."team_members" to "anon";

grant truncate on table "public"."team_members" to "anon";

grant update on table "public"."team_members" to "anon";

grant delete on table "public"."team_members" to "authenticated";

grant insert on table "public"."team_members" to "authenticated";

grant references on table "public"."team_members" to "authenticated";

grant select on table "public"."team_members" to "authenticated";

grant trigger on table "public"."team_members" to "authenticated";

grant truncate on table "public"."team_members" to "authenticated";

grant update on table "public"."team_members" to "authenticated";

grant delete on table "public"."team_members" to "postgres";

grant insert on table "public"."team_members" to "postgres";

grant references on table "public"."team_members" to "postgres";

grant select on table "public"."team_members" to "postgres";

grant trigger on table "public"."team_members" to "postgres";

grant truncate on table "public"."team_members" to "postgres";

grant update on table "public"."team_members" to "postgres";

grant delete on table "public"."team_members" to "service_role";

grant insert on table "public"."team_members" to "service_role";

grant references on table "public"."team_members" to "service_role";

grant select on table "public"."team_members" to "service_role";

grant trigger on table "public"."team_members" to "service_role";

grant truncate on table "public"."team_members" to "service_role";

grant update on table "public"."team_members" to "service_role";

grant delete on table "public"."teams" to "anon";

grant insert on table "public"."teams" to "anon";

grant references on table "public"."teams" to "anon";

grant select on table "public"."teams" to "anon";

grant trigger on table "public"."teams" to "anon";

grant truncate on table "public"."teams" to "anon";

grant update on table "public"."teams" to "anon";

grant delete on table "public"."teams" to "authenticated";

grant insert on table "public"."teams" to "authenticated";

grant references on table "public"."teams" to "authenticated";

grant select on table "public"."teams" to "authenticated";

grant trigger on table "public"."teams" to "authenticated";

grant truncate on table "public"."teams" to "authenticated";

grant update on table "public"."teams" to "authenticated";

grant delete on table "public"."teams" to "postgres";

grant insert on table "public"."teams" to "postgres";

grant references on table "public"."teams" to "postgres";

grant select on table "public"."teams" to "postgres";

grant trigger on table "public"."teams" to "postgres";

grant truncate on table "public"."teams" to "postgres";

grant update on table "public"."teams" to "postgres";

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";

create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id));


create policy "Insert team members through trigger"
on "public"."team_members"
as permissive
for insert
to public
with check (true);


create policy "Only facilitators can update roles"
on "public"."team_members"
as permissive
for update
to public
using (((user_id = auth.uid()) AND (role = 'facilitator'::team_role)));


create policy "team_members_delete_policy"
on "public"."team_members"
as permissive
for delete
to public
using (((EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.team_id = team_members.team_id) AND (tm.user_id = auth.uid()) AND (tm.role = 'facilitator'::team_role)))) OR (user_id = auth.uid())));


create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "teams_delete_policy"
on "public"."teams"
as permissive
for delete
to public
using ((created_by = auth.uid()));


create policy "teams_insert_policy"
on "public"."teams"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


CREATE TRIGGER on_profile_update AFTER UPDATE OF first_name, last_name, avatar_url ON public.profiles FOR EACH ROW EXECUTE FUNCTION sync_team_member_profile();

CREATE TRIGGER on_team_created AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION handle_new_team();

CREATE TRIGGER on_team_member_created AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION handle_team_member();


