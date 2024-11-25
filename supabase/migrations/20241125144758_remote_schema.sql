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


CREATE UNIQUE INDEX tutorial_to_me_pkey ON public.tutorial_to_me USING btree (exercise_id, replied_id);

alter table "public"."tutorial_to_me" add constraint "tutorial_to_me_pkey" PRIMARY KEY using index "tutorial_to_me_pkey";

alter table "public"."tutorial_to_me" add constraint "tutorial_to_me_replied_id_fkey" FOREIGN KEY (replied_id) REFERENCES profiles(id) not valid;

alter table "public"."tutorial_to_me" validate constraint "tutorial_to_me_replied_id_fkey";

alter table "public"."tutorial_to_me" add constraint "tutorial_to_me_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."tutorial_to_me" validate constraint "tutorial_to_me_team_id_fkey";

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


