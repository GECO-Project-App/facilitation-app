drop trigger if exists "check_exercise_completion" on "public"."exercise_data";

drop trigger if exists "update_exercise_status" on "public"."exercise_data";

drop policy "Team members can create their own submissions" on "public"."exercise_data";

drop policy "Team members can view exercise data" on "public"."exercise_data";

drop policy "Users can update their own submissions" on "public"."exercise_data";

alter table "public"."exercise_data" drop constraint "exercise_data_author_id_fkey";

alter table "public"."exercise_data" drop constraint "exercise_data_exercise_id_author_id_key";

alter table "public"."exercise_data" drop constraint "exercise_data_exercise_id_fkey";

alter table "public"."exercise_data" drop constraint "data_schema";

drop index if exists "public"."exercise_data_exercise_id_author_id_key";

drop index if exists "public"."idx_exercise_data_author";

drop index if exists "public"."idx_exercise_data_exercise";

alter table "public"."exercise_data" add constraint "data_schema" CHECK ((jsonb_typeof(data) = 'object'::text)) not valid;

alter table "public"."exercise_data" validate constraint "data_schema";


