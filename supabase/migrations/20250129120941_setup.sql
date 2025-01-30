create extension if not exists "pg_jsonschema" with schema "extensions";


create type "public"."exercise_review_type" as enum ('read_only', 'vote');

create type "public"."exercise_status" as enum ('writing', 'reviewing', 'completed');

create type "public"."team_invitation_status" as enum ('pending', 'awaiting_signup', 'accepted', 'rejected', 'expired');

create type "public"."team_role" as enum ('member', 'facilitator');


create table "public"."exercise_data" (
    "id" uuid not null default gen_random_uuid(),
    "exercise_id" uuid not null,
    "author_id" uuid not null,
    "data" jsonb not null,
    "is_reviewed" boolean default false,
    "created_at" timestamp with time zone default now()
);


alter table "public"."exercise_data" enable row level security;

create table "public"."exercises" (
    "id" uuid not null default gen_random_uuid(),
    "team_id" uuid not null,
    "created_by" uuid not null,
    "created_at" timestamp with time zone default now(),
    "status" exercise_status default 'writing'::exercise_status,
    "review_type" exercise_review_type default 'read_only'::exercise_review_type,
    "deadline" jsonb not null,
    "slug" text not null
);


alter table "public"."exercises" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone default now(),
    "username" text,
    "first_name" text,
    "last_name" text,
    "avatar_url" text
);


alter table "public"."profiles" enable row level security;

create table "public"."team_invitations" (
    "id" uuid not null default gen_random_uuid(),
    "team_id" uuid not null,
    "email" text not null,
    "invited_by" uuid not null,
    "created_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone default (now() + '7 days'::interval),
    "status" team_invitation_status default 'pending'::team_invitation_status
);


alter table "public"."team_invitations" enable row level security;

create table "public"."team_members" (
    "team_id" uuid not null,
    "user_id" uuid not null,
    "role" team_role default 'member'::team_role,
    "joined_at" timestamp with time zone default now(),
    "first_name" text,
    "last_name" text,
    "avatar_url" text,
    "description" character varying(480),
    "profile_name" text
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

CREATE UNIQUE INDEX exercise_data_pkey ON public.exercise_data USING btree (id);

CREATE UNIQUE INDEX exercises_pkey ON public.exercises USING btree (id);

CREATE UNIQUE INDEX exercises_slug_key ON public.exercises USING btree (slug);

CREATE INDEX idx_exercises_slug ON public.exercises USING btree (slug);

CREATE INDEX idx_exercises_status ON public.exercises USING btree (status);

CREATE INDEX idx_exercises_team ON public.exercises USING btree (team_id);

CREATE INDEX idx_team_members_user_team ON public.team_members USING btree (user_id, team_id);

CREATE INDEX idx_teams_created_by ON public.teams USING btree (created_by);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX team_invitations_pkey ON public.team_invitations USING btree (id);

CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (team_id, user_id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

CREATE UNIQUE INDEX teams_team_code_key ON public.teams USING btree (team_code);

alter table "public"."exercise_data" add constraint "exercise_data_pkey" PRIMARY KEY using index "exercise_data_pkey";

alter table "public"."exercises" add constraint "exercises_pkey" PRIMARY KEY using index "exercises_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."team_invitations" add constraint "team_invitations_pkey" PRIMARY KEY using index "team_invitations_pkey";

alter table "public"."team_members" add constraint "team_members_pkey" PRIMARY KEY using index "team_members_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."exercise_data" add constraint "exercise_data_data_check" CHECK ((jsonb_typeof(data) = 'object'::text)) not valid;

alter table "public"."exercise_data" validate constraint "exercise_data_data_check";

alter table "public"."exercises" add constraint "deadline_schema" CHECK (((jsonb_typeof(deadline) = 'object'::text) AND (deadline ? 'writing'::text) AND (deadline ? 'reviewing'::text) AND (jsonb_typeof((deadline -> 'writing'::text)) = 'string'::text) AND (jsonb_typeof((deadline -> 'reviewing'::text)) = 'string'::text) AND ((deadline ->> 'writing'::text) IS NOT NULL) AND ((deadline ->> 'reviewing'::text) IS NOT NULL))) not valid;

alter table "public"."exercises" validate constraint "deadline_schema";

alter table "public"."exercises" add constraint "exercises_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."exercises" validate constraint "exercises_created_by_fkey";

alter table "public"."exercises" add constraint "exercises_slug_key" UNIQUE using index "exercises_slug_key";

alter table "public"."exercises" add constraint "exercises_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."exercises" validate constraint "exercises_team_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "username_length" CHECK (((username IS NULL) OR (char_length(username) >= 3))) not valid;

alter table "public"."profiles" validate constraint "username_length";

alter table "public"."team_invitations" add constraint "team_invitations_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."team_invitations" validate constraint "team_invitations_invited_by_fkey";

alter table "public"."team_invitations" add constraint "team_invitations_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."team_invitations" validate constraint "team_invitations_team_id_fkey";

alter table "public"."team_members" add constraint "team_members_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."team_members" validate constraint "team_members_team_id_fkey";

alter table "public"."team_members" add constraint "team_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."team_members" validate constraint "team_members_user_id_fkey";

alter table "public"."teams" add constraint "teams_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."teams" validate constraint "teams_created_by_fkey";

alter table "public"."teams" add constraint "teams_team_code_key" UNIQUE using index "teams_team_code_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_exercise_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_member_count INT;
    submission_count INT;
BEGIN
    -- Immediate log to confirm trigger is firing
    RAISE LOG 'TRIGGER FIRED: exercise_data changed for exercise_id: %', NEW.exercise_id;
    
    -- Get team member count
    SELECT COUNT(*) INTO team_member_count
    FROM team_members tm
    JOIN exercises e ON e.team_id = tm.team_id
    WHERE e.id = NEW.exercise_id;
    
    RAISE LOG 'Team member count: %', team_member_count;
    
    -- Get submission count
    SELECT COUNT(*) INTO submission_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;
    
    RAISE LOG 'Submission count: %', submission_count;
    
    IF submission_count >= team_member_count THEN
        RAISE LOG 'Attempting to update exercise status to reviewing';
        
        UPDATE exercises
        SET status = 'reviewing'
        WHERE id = NEW.exercise_id
        AND status = 'writing';
        
        RAISE LOG 'Update completed';
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_completion: %', SQLERRM;
    RETURN NEW;
END;
$function$
;


CREATE OR REPLACE FUNCTION public.check_exercise_reviews_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    all_reviewed boolean;
BEGIN
    -- Check if all exercise_data entries for this exercise are reviewed
    SELECT bool_and(is_reviewed)
    INTO all_reviewed
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;

    -- If all are reviewed, update exercise status to completed
    IF all_reviewed THEN
        UPDATE exercises
        SET status = 'completed'
        WHERE id = NEW.exercise_id
        AND status = 'reviewing';
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_team_management_permission(team_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = $1
        AND team_members.user_id = $2
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_user_exists(email_input text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = email_input
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.current_user_email()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce(
    (select email from auth.users where id = auth.uid()),
    (select email from team_invitations where id = current_setting('app.invitation_id', true)::uuid)
  );
$function$
;

CREATE OR REPLACE FUNCTION public.generate_team_code()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
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

CREATE OR REPLACE FUNCTION public.get_pending_users(p_exercise_id uuid, p_status exercise_status)
 RETURNS TABLE(user_id uuid, first_name text, last_name text, profile_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH team_users AS (
        SELECT 
            tm.user_id,
            tm.first_name,
            tm.last_name,
            tm.profile_name
        FROM exercises e
        JOIN team_members tm ON e.team_id = tm.team_id
        WHERE e.id = p_exercise_id
    )
    SELECT 
        tu.user_id,
        tu.first_name,
        tu.last_name,
        tu.profile_name
    FROM team_users tu
    WHERE 
        CASE 
            WHEN p_status = 'writing' AND EXISTS (
                SELECT 1 FROM exercises e 
                WHERE e.id = p_exercise_id 
                AND e.status = 'writing'
            ) THEN
                -- Return users who haven't submitted their exercise data
                NOT EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id
                )
            WHEN p_status = 'reviewing' AND EXISTS (
                SELECT 1 FROM exercises e 
                WHERE e.id = p_exercise_id 
                AND e.status = 'reviewing'
            ) THEN
                -- Return users who have their own unreviewed submissions
                EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id  -- Added correlation to specific user
                    AND ed.is_reviewed = false
                )
            ELSE
                false
        END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_pending_users(p_exercise_id uuid, p_status exercise_status, p_current_user uuid)
 RETURNS TABLE(user_id uuid, first_name text, last_name text, profile_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH team_users AS (
        SELECT 
            tm.user_id,
            tm.first_name,
            tm.last_name,
            tm.profile_name
        FROM exercises e
        JOIN team_members tm ON e.team_id = tm.team_id
        WHERE e.id = p_exercise_id
    )
    SELECT 
        tu.user_id,
        tu.first_name,
        tu.last_name,
        tu.profile_name
    FROM team_users tu
    WHERE 
        CASE 
            WHEN p_status = 'writing' THEN
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM exercise_data ed 
                        WHERE ed.exercise_id = p_exercise_id 
                        AND ed.author_id = p_current_user
                    ) THEN
                        NOT EXISTS (
                            SELECT 1 FROM exercise_data ed 
                            WHERE ed.exercise_id = p_exercise_id 
                            AND ed.author_id = tu.user_id
                        )
                    ELSE
                        false
                END
            WHEN p_status = 'reviewing' THEN
                EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id
                    AND ed.is_reviewed = false
                )
            ELSE
                false
        END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_team_exercise_data(p_exercise_id uuid)
 RETURNS TABLE(id uuid, exercise_id uuid, author_id uuid, data jsonb, created_at timestamp with time zone, is_reviewed boolean, author_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        ed.id,
        ed.exercise_id,
        ed.author_id,
        ed.data,
        ed.created_at,
        ed.is_reviewed,
        tm.profile_name as author_name
    FROM exercise_data ed
    JOIN team_members tm ON tm.user_id = ed.author_id
    JOIN exercises e ON e.id = ed.exercise_id
    WHERE ed.exercise_id = p_exercise_id
    AND tm.team_id = e.team_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_ttm_exercise_data(p_user_id uuid)
 RETURNS TABLE(exercise_id uuid, author_id uuid, data jsonb, is_reviewed boolean, created_at timestamp with time zone, exercise_status exercise_status, exercise_deadline jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  return query
  select 
    ed.exercise_id,
    ed.author_id,
    ed.data,
    ed.is_reviewed,
    ed.created_at,
    e.status as exercise_status,
    e.deadline::jsonb as exercise_deadline  -- Cast deadline to jsonb
  from exercises e
  inner join exercise_data ed on e.id = ed.exercise_id
  where e.slug = 'ttm'
  and ed.author_id = p_user_id
  order by ed.created_at desc
  limit 1;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_team()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.increment_exercise_vote(p_exercise_data_id uuid, p_json_path text[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_value INTEGER;
  updated_data JSONB;
BEGIN
  -- Get the current vote count
  SELECT (data #>> p_json_path)::INTEGER
  INTO current_value
  FROM exercise_data
  WHERE id = p_exercise_data_id;

  -- Increment the vote count
  UPDATE exercise_data
  SET data = jsonb_set(
    data::jsonb,
    p_json_path,
    ((COALESCE(current_value, 0) + 1)::TEXT)::jsonb
  )
  WHERE id = p_exercise_data_id
  RETURNING data INTO updated_data;

  RETURN updated_data;
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
$function$
;

CREATE OR REPLACE FUNCTION public.join_team_by_invitation(invitation_id uuid, p_user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_team_id uuid;
    v_invitation record;
    v_profile record;
BEGIN
    -- Get invitation details
    SELECT *
    INTO v_invitation
    FROM team_invitations ti
    WHERE ti.id = invitation_id 
    AND ti.status IN ('awaiting_signup', 'pending');

    IF v_invitation IS NULL THEN
        RAISE EXCEPTION 'Invalid invitation';
    END IF;

    -- Get profile
    SELECT *
    INTO v_profile
    FROM profiles p
    WHERE p.id = p_user_id;

    IF v_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    -- Check if user is already a member
    IF EXISTS (
        SELECT 1 FROM team_members tm
        WHERE tm.team_id = v_invitation.team_id 
        AND tm.user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'User is already a team member';
    END IF;

    -- Insert team member
    INSERT INTO team_members (
        team_id,
        user_id,
        role,
        first_name,
        last_name,
        avatar_url,
        profile_name
    )
    VALUES (
        v_invitation.team_id,
        p_user_id,
        'member',
        v_profile.first_name,
        v_profile.last_name,
        v_profile.avatar_url,
        CONCAT(v_profile.first_name, ' ', v_profile.last_name)
    );

    -- Update invitation status
    UPDATE team_invitations
    SET status = 'accepted'
    WHERE id = invitation_id;

    RETURN v_invitation.team_id;
END;
$function$
;


CREATE OR REPLACE FUNCTION public.refresh_team_permissions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_permissions;
    RETURN NULL;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_profile_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.sync_team_member_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Only proceed if avatar_url has changed
    IF OLD.avatar_url IS DISTINCT FROM NEW.avatar_url THEN
        UPDATE team_members
        SET avatar_url = NEW.avatar_url
        WHERE user_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_team_member_profile(p_team_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    profile_exists boolean;
BEGIN
    -- Check if profile exists and has required data
    SELECT EXISTS (
        SELECT 1 
        FROM profiles p 
        WHERE p.id = p_user_id 
        AND p.first_name IS NOT NULL 
        AND p.last_name IS NOT NULL
    ) INTO profile_exists;

    IF NOT profile_exists THEN
        RETURN false;
    END IF;

    -- Update team member with latest profile info
    UPDATE team_members tm
    SET 
        first_name = p.first_name,
        last_name = p.last_name,
        avatar_url = p.avatar_url,
        profile_name = CONCAT(p.first_name, ' ', p.last_name)
    FROM profiles p
    WHERE p.id = p_user_id
    AND tm.user_id = p_user_id
    AND tm.team_id = p_team_id;

    RETURN true;
END;
$function$
;

create materialized view "public"."team_permissions" as  SELECT DISTINCT tm.team_id,
    tm.user_id
   FROM team_members tm;


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

CREATE OR REPLACE FUNCTION public.update_team_member_profile(p_team_id uuid, p_profile_name text DEFAULT NULL::text, p_description text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_team_member_profile_name(p_team_id uuid, p_profile_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE team_members
    SET profile_name = p_profile_name
    WHERE team_id = p_team_id 
    AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$function$
;

CREATE UNIQUE INDEX team_permissions_idx ON public.team_permissions USING btree (team_id, user_id);

grant delete on table "public"."exercise_data" to "anon";

grant insert on table "public"."exercise_data" to "anon";

grant references on table "public"."exercise_data" to "anon";

grant select on table "public"."exercise_data" to "anon";

grant trigger on table "public"."exercise_data" to "anon";

grant truncate on table "public"."exercise_data" to "anon";

grant update on table "public"."exercise_data" to "anon";

grant delete on table "public"."exercise_data" to "authenticated";

grant insert on table "public"."exercise_data" to "authenticated";

grant references on table "public"."exercise_data" to "authenticated";

grant select on table "public"."exercise_data" to "authenticated";

grant trigger on table "public"."exercise_data" to "authenticated";

grant truncate on table "public"."exercise_data" to "authenticated";

grant update on table "public"."exercise_data" to "authenticated";

grant delete on table "public"."exercise_data" to "service_role";

grant insert on table "public"."exercise_data" to "service_role";

grant references on table "public"."exercise_data" to "service_role";

grant select on table "public"."exercise_data" to "service_role";

grant trigger on table "public"."exercise_data" to "service_role";

grant truncate on table "public"."exercise_data" to "service_role";

grant update on table "public"."exercise_data" to "service_role";

grant delete on table "public"."exercises" to "anon";

grant insert on table "public"."exercises" to "anon";

grant references on table "public"."exercises" to "anon";

grant select on table "public"."exercises" to "anon";

grant trigger on table "public"."exercises" to "anon";

grant truncate on table "public"."exercises" to "anon";

grant update on table "public"."exercises" to "anon";

grant delete on table "public"."exercises" to "authenticated";

grant insert on table "public"."exercises" to "authenticated";

grant references on table "public"."exercises" to "authenticated";

grant select on table "public"."exercises" to "authenticated";

grant trigger on table "public"."exercises" to "authenticated";

grant truncate on table "public"."exercises" to "authenticated";

grant update on table "public"."exercises" to "authenticated";

grant delete on table "public"."exercises" to "service_role";

grant insert on table "public"."exercises" to "service_role";

grant references on table "public"."exercises" to "service_role";

grant select on table "public"."exercises" to "service_role";

grant trigger on table "public"."exercises" to "service_role";

grant truncate on table "public"."exercises" to "service_role";

grant update on table "public"."exercises" to "service_role";

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

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."team_invitations" to "anon";

grant insert on table "public"."team_invitations" to "anon";

grant references on table "public"."team_invitations" to "anon";

grant select on table "public"."team_invitations" to "anon";

grant trigger on table "public"."team_invitations" to "anon";

grant truncate on table "public"."team_invitations" to "anon";

grant update on table "public"."team_invitations" to "anon";

grant delete on table "public"."team_invitations" to "authenticated";

grant insert on table "public"."team_invitations" to "authenticated";

grant references on table "public"."team_invitations" to "authenticated";

grant select on table "public"."team_invitations" to "authenticated";

grant trigger on table "public"."team_invitations" to "authenticated";

grant truncate on table "public"."team_invitations" to "authenticated";

grant update on table "public"."team_invitations" to "authenticated";

grant delete on table "public"."team_invitations" to "service_role";

grant insert on table "public"."team_invitations" to "service_role";

grant references on table "public"."team_invitations" to "service_role";

grant select on table "public"."team_invitations" to "service_role";

grant trigger on table "public"."team_invitations" to "service_role";

grant truncate on table "public"."team_invitations" to "service_role";

grant update on table "public"."team_invitations" to "service_role";

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

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";

create policy "Users can insert their own exercise data"
on "public"."exercise_data"
as permissive
for insert
to authenticated
with check ((auth.uid() = author_id));


create policy "Users can read their own exercise data"
on "public"."exercise_data"
as permissive
for select
to authenticated
using ((auth.uid() = author_id));


create policy "Users can update their own exercise data"
on "public"."exercise_data"
as permissive
for update
to authenticated
using ((auth.uid() = author_id))
with check ((auth.uid() = author_id));


create policy "Enable trigger updates on exercises"
on "public"."exercises"
as permissive
for update
to public
using (true)
with check (true);


create policy "Only facilitators can create exercises"
on "public"."exercises"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = exercises.team_id) AND (team_members.user_id = auth.uid()) AND (team_members.role = 'facilitator'::team_role)))));


create policy "Team members can view exercises"
on "public"."exercises"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = exercises.team_id) AND (team_members.user_id = auth.uid())))));


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
with check ((auth.uid() = id));


create policy "Users can update their own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Read invitations"
on "public"."team_invitations"
as permissive
for select
to public
using (true);


create policy "Team members can create invitations"
on "public"."team_invitations"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invitations.team_id) AND (team_members.user_id = auth.uid())))));


create policy "Update invitations"
on "public"."team_invitations"
as permissive
for update
to public
using (true);


create policy "Update own invitations"
on "public"."team_invitations"
as permissive
for update
to authenticated
using ((email = auth.email()));


create policy "Enable insert for authenticated users"
on "public"."team_members"
as permissive
for insert
to authenticated
with check (true);


create policy "Insert members"
on "public"."team_members"
as permissive
for insert
to public
with check (true);


create policy "team_members_access_policy"
on "public"."team_members"
as permissive
for all
to authenticated
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_permissions tp
  WHERE ((tp.team_id = team_members.team_id) AND (tp.user_id = auth.uid()))))));


create policy "teams_access_policy"
on "public"."teams"
as permissive
for all
to authenticated
using (((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_permissions tp
  WHERE ((tp.team_id = teams.id) AND (tp.user_id = auth.uid())))) OR (team_code IS NOT NULL)));


CREATE TRIGGER check_exercise_reviews_completion_trigger AFTER UPDATE OF is_reviewed ON public.exercise_data FOR EACH ROW WHEN ((new.is_reviewed = true)) EXECUTE FUNCTION check_exercise_reviews_completion();

CREATE TRIGGER update_exercise_status AFTER INSERT OR UPDATE ON public.exercise_data FOR EACH ROW EXECUTE FUNCTION check_exercise_completion();

CREATE TRIGGER sync_profile_changes AFTER UPDATE OF first_name, last_name, avatar_url ON public.profiles FOR EACH ROW EXECUTE FUNCTION sync_profile_changes();

CREATE TRIGGER refresh_team_permissions_on_member_change AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_permissions();

CREATE TRIGGER on_team_created AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION handle_new_team();




