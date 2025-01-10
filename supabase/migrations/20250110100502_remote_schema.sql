drop policy "Only facilitators can delete exercises" on "public"."exercises";

alter table "public"."exercises" drop constraint "data_schema";

alter table "public"."exercises" drop constraint "pending_users_schema";

alter table "public"."exercises" drop constraint "deadline_schema";

create table "public"."exercise_data" (
    "id" uuid not null default gen_random_uuid(),
    "exercise_id" uuid not null,
    "author_id" uuid not null,
    "data" jsonb not null,
    "is_reviewed" boolean default false,
    "created_at" timestamp with time zone default now()
);


alter table "public"."exercise_data" enable row level security;

alter table "public"."exercises" drop column "data";

alter table "public"."exercises" drop column "pending_users";

alter table "public"."exercises" add column "slug" text not null;

CREATE UNIQUE INDEX exercise_data_exercise_id_author_id_key ON public.exercise_data USING btree (exercise_id, author_id);

CREATE UNIQUE INDEX exercise_data_pkey ON public.exercise_data USING btree (id);

CREATE UNIQUE INDEX exercises_slug_key ON public.exercises USING btree (slug);

CREATE INDEX idx_exercise_data_author ON public.exercise_data USING btree (author_id);

CREATE INDEX idx_exercise_data_exercise ON public.exercise_data USING btree (exercise_id);

CREATE INDEX idx_exercises_slug ON public.exercises USING btree (slug);

alter table "public"."exercise_data" add constraint "exercise_data_pkey" PRIMARY KEY using index "exercise_data_pkey";

alter table "public"."exercise_data" add constraint "data_schema" CHECK (((jsonb_typeof(data) = 'array'::text) AND (jsonb_array_length(data) = 3))) not valid;

alter table "public"."exercise_data" validate constraint "data_schema";

alter table "public"."exercise_data" add constraint "exercise_data_author_id_fkey" FOREIGN KEY (author_id) REFERENCES profiles(id) not valid;

alter table "public"."exercise_data" validate constraint "exercise_data_author_id_fkey";

alter table "public"."exercise_data" add constraint "exercise_data_exercise_id_author_id_key" UNIQUE using index "exercise_data_exercise_id_author_id_key";

alter table "public"."exercise_data" add constraint "exercise_data_exercise_id_fkey" FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE not valid;

alter table "public"."exercise_data" validate constraint "exercise_data_exercise_id_fkey";

alter table "public"."exercises" add constraint "exercises_slug_key" UNIQUE using index "exercises_slug_key";

alter table "public"."exercises" add constraint "deadline_schema" CHECK (((deadline @> '{"writing": "", "reviewing": ""}'::jsonb) AND (jsonb_typeof(deadline) = 'object'::text) AND (((deadline ->> 'writing'::text))::timestamp with time zone IS NOT NULL) AND (((deadline ->> 'reviewing'::text))::timestamp with time zone IS NOT NULL))) not valid;

alter table "public"."exercises" validate constraint "deadline_schema";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_exercise_completion()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    team_member_count INT;
    submission_count INT;
    review_count INT;
BEGIN
    -- Get team member count
    SELECT COUNT(*) INTO team_member_count
    FROM team_members
    WHERE team_id = (
        SELECT team_id 
        FROM exercises 
        WHERE id = NEW.exercise_id
    );
    
    -- Get submission count for this exercise
    SELECT COUNT(*) INTO submission_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;
    
    -- Get review count for this exercise
    SELECT COUNT(*) INTO review_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id
    AND is_reviewed = true;
    
    -- Update exercise status if needed
    IF submission_count = team_member_count THEN
        UPDATE exercises
        SET status = 'reviewing'
        WHERE id = NEW.exercise_id
        AND status = 'writing';
    END IF;
    
    IF review_count = team_member_count THEN
        UPDATE exercises
        SET status = 'completed'
        WHERE id = NEW.exercise_id
        AND status = 'reviewing';
    END IF;
    
    RETURN NEW;
END;
$function$
;

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

create policy "Team members can create their own submissions"
on "public"."exercise_data"
as permissive
for insert
to authenticated
with check (((auth.uid() = author_id) AND (EXISTS ( SELECT 1
   FROM (exercises e
     JOIN team_members tm ON ((tm.team_id = e.team_id)))
  WHERE ((e.id = exercise_data.exercise_id) AND (tm.user_id = auth.uid()))))));


create policy "Team members can view exercise data"
on "public"."exercise_data"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM (exercises e
     JOIN team_members tm ON ((tm.team_id = e.team_id)))
  WHERE ((e.id = exercise_data.exercise_id) AND (tm.user_id = auth.uid())))));


create policy "Users can update their own submissions"
on "public"."exercise_data"
as permissive
for update
to authenticated
using ((author_id = auth.uid()))
with check ((author_id = auth.uid()));


CREATE TRIGGER update_exercise_status AFTER INSERT OR UPDATE ON public.exercise_data FOR EACH ROW EXECUTE FUNCTION check_exercise_completion();


