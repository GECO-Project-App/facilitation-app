create type "public"."team_invite_link_status" as enum ('active', 'expired');

create table "public"."team_invite_links" (
    "id" uuid not null default gen_random_uuid(),
    "team_id" uuid,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone default (now() + '10 days'::interval),
    "status" team_invite_link_status default 'active'::team_invite_link_status
);


alter table "public"."team_invite_links" enable row level security;

alter table "public"."team_invitations" enable row level security;

CREATE UNIQUE INDEX team_invite_links_pkey ON public.team_invite_links USING btree (id);

alter table "public"."team_invite_links" add constraint "team_invite_links_pkey" PRIMARY KEY using index "team_invite_links_pkey";

alter table "public"."team_invite_links" add constraint "team_invite_links_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."team_invite_links" validate constraint "team_invite_links_created_by_fkey";

alter table "public"."team_invite_links" add constraint "team_invite_links_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."team_invite_links" validate constraint "team_invite_links_team_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.join_team_by_invite_link(link_id uuid, p_user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_id_var uuid;
BEGIN
    -- Get and validate invite link
    SELECT team_id INTO team_id_var
    FROM team_invite_links
    WHERE id = link_id 
    AND status = 'active'
    AND expires_at > now();

    IF team_id_var IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired invite link';
    END IF;

    -- Insert team member with profile info
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
        p_user_id,
        'member',
        p.first_name,
        p.last_name,
        p.avatar_url,
        CONCAT(p.first_name, ' ', p.last_name)
    FROM profiles p
    WHERE p.id = p_user_id
    ON CONFLICT (team_id, user_id) DO NOTHING;

    RETURN team_id_var;
END;
$function$
;

grant delete on table "public"."team_invite_links" to "anon";

grant insert on table "public"."team_invite_links" to "anon";

grant references on table "public"."team_invite_links" to "anon";

grant select on table "public"."team_invite_links" to "anon";

grant trigger on table "public"."team_invite_links" to "anon";

grant truncate on table "public"."team_invite_links" to "anon";

grant update on table "public"."team_invite_links" to "anon";

grant delete on table "public"."team_invite_links" to "authenticated";

grant insert on table "public"."team_invite_links" to "authenticated";

grant references on table "public"."team_invite_links" to "authenticated";

grant select on table "public"."team_invite_links" to "authenticated";

grant trigger on table "public"."team_invite_links" to "authenticated";

grant truncate on table "public"."team_invite_links" to "authenticated";

grant update on table "public"."team_invite_links" to "authenticated";

grant delete on table "public"."team_invite_links" to "service_role";

grant insert on table "public"."team_invite_links" to "service_role";

grant references on table "public"."team_invite_links" to "service_role";

grant select on table "public"."team_invite_links" to "service_role";

grant trigger on table "public"."team_invite_links" to "service_role";

grant truncate on table "public"."team_invite_links" to "service_role";

grant update on table "public"."team_invite_links" to "service_role";

create policy "Anyone can view active invite links"
on "public"."team_invite_links"
as permissive
for select
to authenticated
using (((status = 'active'::team_invite_link_status) AND (expires_at > now())));


create policy "Team members can create invite links"
on "public"."team_invite_links"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invite_links.team_id) AND (team_members.user_id = auth.uid())))));



