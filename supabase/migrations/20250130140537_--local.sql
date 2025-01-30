create type "public"."team_invitation_status" as enum ('pending', 'awaiting_signup', 'accepted', 'rejected', 'expired');

create type "public"."team_role" as enum ('member', 'facilitator');

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

create table "public"."tutorial_to_me" (
    "exercise_id" uuid not null default gen_random_uuid(),
    "replied_id" uuid not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "created_by" uuid default auth.uid(),
    "team_id" uuid,
    "writing_date" text,
    "writing_time" text,
    "reviewing_date" text,
    "reviewing_time" text,
    "is_active" boolean default true,
    "strengths" text,
    "weaknesses" text,
    "communications" text,
    "reviewed" boolean default false
);


CREATE INDEX idx_team_members_user_team ON public.team_members USING btree (user_id, team_id);

CREATE INDEX idx_teams_created_by ON public.teams USING btree (created_by);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX team_invitations_pkey ON public.team_invitations USING btree (id);

CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (team_id, user_id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

CREATE UNIQUE INDEX teams_team_code_key ON public.teams USING btree (team_code);

CREATE UNIQUE INDEX tutorial_to_me_pkey ON public.tutorial_to_me USING btree (exercise_id, replied_id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."team_invitations" add constraint "team_invitations_pkey" PRIMARY KEY using index "team_invitations_pkey";

alter table "public"."team_members" add constraint "team_members_pkey" PRIMARY KEY using index "team_members_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."tutorial_to_me" add constraint "tutorial_to_me_pkey" PRIMARY KEY using index "tutorial_to_me_pkey";

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

alter table "public"."tutorial_to_me" add constraint "tutorial_to_me_replied_id_fkey" FOREIGN KEY (replied_id) REFERENCES profiles(id) not valid;

alter table "public"."tutorial_to_me" validate constraint "tutorial_to_me_replied_id_fkey";

alter table "public"."tutorial_to_me" add constraint "tutorial_to_me_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."tutorial_to_me" validate constraint "tutorial_to_me_team_id_fkey";

set check_function_bodies = off;

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

create type "public"."profile_response" as ("id" uuid, "username" text, "first_name" text, "last_name" text, "avatar_url" text, "updated_at" timestamp with time zone);

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

grant delete on table "public"."tutorial_to_me" to "anon";

grant insert on table "public"."tutorial_to_me" to "anon";

grant references on table "public"."tutorial_to_me" to "anon";

grant select on table "public"."tutorial_to_me" to "anon";

grant trigger on table "public"."tutorial_to_me" to "anon";

grant truncate on table "public"."tutorial_to_me" to "anon";

grant update on table "public"."tutorial_to_me" to "anon";

grant delete on table "public"."tutorial_to_me" to "authenticated";

grant insert on table "public"."tutorial_to_me" to "authenticated";

grant references on table "public"."tutorial_to_me" to "authenticated";

grant select on table "public"."tutorial_to_me" to "authenticated";

grant trigger on table "public"."tutorial_to_me" to "authenticated";

grant truncate on table "public"."tutorial_to_me" to "authenticated";

grant update on table "public"."tutorial_to_me" to "authenticated";

grant delete on table "public"."tutorial_to_me" to "service_role";

grant insert on table "public"."tutorial_to_me" to "service_role";

grant references on table "public"."tutorial_to_me" to "service_role";

grant select on table "public"."tutorial_to_me" to "service_role";

grant trigger on table "public"."tutorial_to_me" to "service_role";

grant truncate on table "public"."tutorial_to_me" to "service_role";

grant update on table "public"."tutorial_to_me" to "service_role";

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


CREATE TRIGGER sync_profile_changes AFTER UPDATE OF first_name, last_name, avatar_url ON public.profiles FOR EACH ROW EXECUTE FUNCTION sync_profile_changes();

CREATE TRIGGER refresh_team_permissions_on_member_change AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_permissions();

CREATE TRIGGER on_team_created AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION handle_new_team();


