set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_pending_exercise_submissions(exercise_id uuid)
 RETURNS TABLE(user_id uuid, first_name text, last_name text, profile_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH exercise_info AS (
        SELECT 
            e.team_id, 
            e.deadline,
            e.status,
            (SELECT COUNT(*) FROM exercise_data WHERE exercise_id = e.id) as total_submissions
        FROM exercises e
        WHERE e.id = exercise_id
    )
    SELECT 
        tm.user_id,
        tm.first_name,
        tm.last_name,
        tm.profile_name
    FROM team_members tm
    CROSS JOIN exercise_info ei
    WHERE tm.team_id = ei.team_id
    AND (
        -- For writing phase
        (ei.status = 'writing' AND NOT EXISTS (
            SELECT 1 
            FROM exercise_data ed
            WHERE ed.exercise_id = exercise_id
            AND ed.author_id = tm.user_id
        ))
        OR
        -- For reviewing phase
        (ei.status = 'reviewing' AND (
            SELECT COUNT(*)
            FROM exercise_data ed
            WHERE ed.exercise_id = exercise_id
            AND ed.reviewer_id = tm.user_id
        ) < ei.total_submissions - 1) -- Subtract 1 to exclude their own submission
    )
    AND ei.deadline > NOW() -- Only include if deadline hasn't passed
    ORDER BY tm.profile_name;
END;
$function$
;


