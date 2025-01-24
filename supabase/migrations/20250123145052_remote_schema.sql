alter table "public"."exercise_data" drop constraint "vote_schema_check";

alter table "public"."exercise_data" drop column "vote";

alter table "public"."exercise_data" add constraint "exercise_data_data_check" CHECK (((jsonb_typeof(data) = 'object'::text) AND ((data ? 'strengths'::text) AND (data ? 'weaknesses'::text) AND (data ? 'communication'::text)) AND ((jsonb_typeof((data -> 'strengths'::text)) = 'object'::text) AND ((data -> 'strengths'::text) ? 'value'::text) AND ((data -> 'strengths'::text) ? 'vote'::text) AND (jsonb_typeof(((data -> 'strengths'::text) -> 'vote'::text)) = 'object'::text) AND (((data -> 'strengths'::text) -> 'vote'::text) ? 'yes'::text) AND (((data -> 'strengths'::text) -> 'vote'::text) ? 'no'::text)) AND ((jsonb_typeof((data -> 'weaknesses'::text)) = 'object'::text) AND ((data -> 'weaknesses'::text) ? 'value'::text) AND ((data -> 'weaknesses'::text) ? 'vote'::text) AND (jsonb_typeof(((data -> 'weaknesses'::text) -> 'vote'::text)) = 'object'::text) AND (((data -> 'weaknesses'::text) -> 'vote'::text) ? 'yes'::text) AND (((data -> 'weaknesses'::text) -> 'vote'::text) ? 'no'::text)) AND ((jsonb_typeof((data -> 'communication'::text)) = 'object'::text) AND ((data -> 'communication'::text) ? 'value'::text) AND ((data -> 'communication'::text) ? 'vote'::text) AND (jsonb_typeof(((data -> 'communication'::text) -> 'vote'::text)) = 'object'::text) AND (((data -> 'communication'::text) -> 'vote'::text) ? 'yes'::text) AND (((data -> 'communication'::text) -> 'vote'::text) ? 'no'::text)))) not valid;

alter table "public"."exercise_data" validate constraint "exercise_data_data_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.vote_on_exercise(p_exercise_id uuid, p_field text, p_vote_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF p_vote_type NOT IN ('yes', 'no') THEN
    RAISE EXCEPTION 'Invalid vote type. Must be "yes" or "no"';
  END IF;

  IF p_field NOT IN ('strengths', 'weaknesses', 'communication') THEN
    RAISE EXCEPTION 'Invalid field. Must be "strengths", "weaknesses", or "communication"';
  END IF;

  UPDATE exercise_data
  SET data = jsonb_set(
    data,
    ARRAY[p_field, 'vote', p_vote_type],
    (COALESCE((data->p_field->'vote'->p_vote_type)::int, 0) + 1)::text::jsonb
  )
  WHERE exercise_id = p_exercise_id;
END;
$function$
;


