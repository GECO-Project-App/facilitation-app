set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_team_exercise_data(p_exercise_id uuid)
 RETURNS TABLE(id uuid, exercise_id uuid, author_id uuid, data jsonb, created_at timestamp with time zone, is_reviewed boolean, author_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        ed.id,
        ed.exercise_id,
        ed.author_id,
        ed.data,
        ed.created_at,
        ed.is_reviewed,
        tm.profile_name as author_name
    FROM exercise_data ed
    JOIN team_members tm ON tm.user_id = ed.author_id
    JOIN exercises e ON e.id = ed.exercise_id
    WHERE ed.exercise_id = p_exercise_id
    AND tm.team_id = e.team_id;
END;
$function$
;


