alter table "public"."exercises" drop constraint "deadline_schema";

alter table "public"."exercises" add constraint "deadline_schema" CHECK (((jsonb_typeof(deadline) = 'object'::text) AND (deadline ? 'writing'::text) AND (deadline ? 'reviewing'::text) AND (jsonb_typeof((deadline -> 'writing'::text)) = 'string'::text) AND (jsonb_typeof((deadline -> 'reviewing'::text)) = 'string'::text) AND ((deadline ->> 'writing'::text) IS NOT NULL) AND ((deadline ->> 'reviewing'::text) IS NOT NULL))) not valid;

alter table "public"."exercises" validate constraint "deadline_schema";


