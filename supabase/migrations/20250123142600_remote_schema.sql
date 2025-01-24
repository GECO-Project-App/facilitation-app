alter table "public"."exercise_data" add column "vote" jsonb default '{"no": 0, "yes": 0}'::jsonb;

alter table "public"."exercise_data" add constraint "vote_schema_check" CHECK (((vote IS NULL) OR ((jsonb_typeof((vote -> 'yes'::text)) = 'number'::text) AND (jsonb_typeof((vote -> 'no'::text)) = 'number'::text)))) not valid;

alter table "public"."exercise_data" validate constraint "vote_schema_check";


