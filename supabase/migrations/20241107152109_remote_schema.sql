create table "public"."team_members" (
    "team_id" uuid not null,
    "user_id" uuid not null,
    "role" team_role default 'member'::team_role,
    "joined_at" timestamp with time zone default now(),
    "first_name" text,
    "last_name" text,
    "avatar_url" text
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

CREATE INDEX idx_teams_created_by ON public.teams USING btree (created_by);

CREATE UNIQUE INDEX team_members_pkey ON public.team_members USING btree (team_id, user_id);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

CREATE UNIQUE INDEX teams_team_code_key ON public.teams USING btree (team_code);

alter table "public"."team_members" add constraint "team_members_pkey" PRIMARY KEY using index "team_members_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

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
        SELECT 1 FROM team_members
        WHERE team_members.team_id = $1
        AND team_members.user_id = $2
        AND team_members.role = 'facilitator'
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_team()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Generate team code
    NEW.team_code := generate_team_code();
    
    -- Insert the creator as a facilitator
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'facilitator');
    
    RETURN NEW;
END;
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

create policy "team_members_delete_policy"
on "public"."team_members"
as permissive
for delete
to public
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_members team_members_1
  WHERE ((team_members_1.team_id = team_members_1.team_id) AND (team_members_1.user_id = auth.uid()) AND (team_members_1.role = 'facilitator'::team_role))))));


create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using ((team_id IN ( SELECT team_members_1.team_id
   FROM team_members team_members_1
  WHERE (team_members_1.user_id = auth.uid()))));


create policy "team_members_update_policy"
on "public"."team_members"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM team_members team_members_1
  WHERE ((team_members_1.team_id = team_members_1.team_id) AND (team_members_1.user_id = auth.uid()) AND (team_members_1.role = 'facilitator'::team_role)))));


create policy "teams_delete_policy"
on "public"."teams"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = teams.id) AND (team_members.user_id = auth.uid()) AND (team_members.role = 'facilitator'::team_role)))));


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
using ((id IN ( SELECT team_members.team_id
   FROM team_members
  WHERE (team_members.user_id = auth.uid()))));


CREATE TRIGGER on_team_created BEFORE INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION handle_new_team();


