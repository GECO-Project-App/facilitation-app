create type "public"."exercise_review_type" as enum ('read_only', 'vote');

create type "public"."exercise_status" as enum ('writing', 'reviewing', 'completed');

create table "public"."exercises" (
    "id" uuid not null default gen_random_uuid(),
    "team_id" uuid not null,
    "created_by" uuid not null,
    "created_at" timestamp with time zone default now(),
    "status" exercise_status default 'writing'::exercise_status,
    "review_type" exercise_review_type default 'read_only'::exercise_review_type,
    "deadline" jsonb not null,
    "data" jsonb,
    "pending_users" jsonb default '{"writing": [], "reviewing": []}'::jsonb
);


alter table "public"."exercises" enable row level security;

CREATE UNIQUE INDEX exercises_pkey ON public.exercises USING btree (id);

CREATE INDEX idx_exercises_status ON public.exercises USING btree (status);

CREATE INDEX idx_exercises_team ON public.exercises USING btree (team_id);

alter table "public"."exercises" add constraint "exercises_pkey" PRIMARY KEY using index "exercises_pkey";

alter table "public"."exercises" add constraint "data_schema" CHECK (((data IS NULL) OR ((jsonb_typeof(data) = 'array'::text) AND (jsonb_array_length(data) = 3)))) not valid;

alter table "public"."exercises" validate constraint "data_schema";

alter table "public"."exercises" add constraint "deadline_schema" CHECK (((deadline @> '{"writing": "", "reviewing": ""}'::jsonb) AND (jsonb_typeof(deadline) = 'object'::text) AND (jsonb_typeof((deadline -> 'writing'::text)) = 'string'::text) AND (jsonb_typeof((deadline -> 'reviewing'::text)) = 'string'::text))) not valid;

alter table "public"."exercises" validate constraint "deadline_schema";

alter table "public"."exercises" add constraint "exercises_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."exercises" validate constraint "exercises_created_by_fkey";

alter table "public"."exercises" add constraint "exercises_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE not valid;

alter table "public"."exercises" validate constraint "exercises_team_id_fkey";

alter table "public"."exercises" add constraint "pending_users_schema" CHECK (((pending_users @> '{"writing": [], "reviewing": []}'::jsonb) AND (jsonb_typeof(pending_users) = 'object'::text) AND (jsonb_typeof((pending_users -> 'writing'::text)) = 'array'::text) AND (jsonb_typeof((pending_users -> 'reviewing'::text)) = 'array'::text))) not valid;

alter table "public"."exercises" validate constraint "pending_users_schema";

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

create policy "Only facilitators can create exercises"
on "public"."exercises"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = exercises.team_id) AND (team_members.user_id = auth.uid()) AND (team_members.role = 'facilitator'::team_role)))));


create policy "Only facilitators can delete exercises"
on "public"."exercises"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
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



