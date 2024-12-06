create table "public"."team_invitations" (
    "id" uuid not null default gen_random_uuid(),
    "team_id" uuid not null,
    "email" text not null,
    "invited_by" uuid not null,
    "created_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone default (now() + '7 days'::interval),
    "status" text default 'pending'::text
);


alter table "public"."team_invitations" enable row level security;

CREATE UNIQUE INDEX team_invitations_pkey ON public.team_invitations USING btree (id);

alter table "public"."team_invitations" add constraint "team_invitations_pkey" PRIMARY KEY using index "team_invitations_pkey";

alter table "public"."team_invitations" add constraint "team_invitations_invited_by_fkey" FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."team_invitations" validate constraint "team_invitations_invited_by_fkey";

alter table "public"."team_invitations" add constraint "team_invitations_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'expired'::text, 'cancelled'::text]))) not valid;

alter table "public"."team_invitations" validate constraint "team_invitations_status_check";

alter table "public"."team_invitations" add constraint "team_invitations_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."team_invitations" validate constraint "team_invitations_team_id_fkey";

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

create policy "Facilitators can create invitations"
on "public"."team_invitations"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invitations.team_id) AND (team_members.user_id = auth.uid()) AND (team_members.role = 'facilitator'::team_role)))));


create policy "Team members can view invitations"
on "public"."team_invitations"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invitations.team_id) AND (team_members.user_id = auth.uid())))));



