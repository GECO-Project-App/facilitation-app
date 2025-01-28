set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.increment_exercise_vote(p_exercise_data_id uuid, p_json_path text[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_value INTEGER;
  updated_data JSONB;
BEGIN
  -- Get the current vote count
  SELECT (data #>> p_json_path)::INTEGER
  INTO current_value
  FROM exercise_data
  WHERE id = p_exercise_data_id;

  -- Increment the vote count
  UPDATE exercise_data
  SET data = jsonb_set(
    data::jsonb,
    p_json_path,
    ((COALESCE(current_value, 0) + 1)::TEXT)::jsonb
  )
  WHERE id = p_exercise_data_id
  RETURNING data INTO updated_data;

  RETURN updated_data;
END;
$function$
;


