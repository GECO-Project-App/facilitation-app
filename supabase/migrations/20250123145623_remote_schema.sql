set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.vote_on_exercise(p_exercise_id uuid, p_author_id uuid, p_field text, p_vote_type text)
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
  WHERE exercise_id = p_exercise_id
  AND author_id = p_author_id;
END;
$function$
;


