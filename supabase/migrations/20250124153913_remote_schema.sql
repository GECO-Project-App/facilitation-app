alter table "public"."exercise_data" drop constraint "data_schema";

alter table "public"."exercise_data" drop constraint "exercise_data_data_check";

alter table "public"."exercise_data" add constraint "exercise_data_data_check" CHECK ((jsonb_typeof(data) = 'object'::text)) not valid;

alter table "public"."exercise_data" validate constraint "exercise_data_data_check";


