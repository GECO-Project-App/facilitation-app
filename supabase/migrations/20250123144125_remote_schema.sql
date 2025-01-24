set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.vote_on_exercise(p_exercise_id uuid, p_author_id uuid, p_vote_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF p_vote_type NOT IN ('yes', 'no') THEN
    RAISE EXCEPTION 'Invalid vote type. Must be "yes" or "no"';
  END IF;

  UPDATE exercise_data
  SET vote = jsonb_set(
    COALESCE(vote, '{"yes": 0, "no": 0}'::jsonb),
    ARRAY[p_vote_type],
    (COALESCE((vote->>p_vote_type)::int, 0) + 1)::text::jsonb
  )
  WHERE exercise_id = p_exercise_id 
  AND author_id = p_author_id;
END;
$function$
;


