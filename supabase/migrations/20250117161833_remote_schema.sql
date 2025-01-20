drop function if exists "public"."get_pending_exercise_submissions"(exercise_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_pending_users(p_exercise_id uuid, p_status exercise_status)
 RETURNS TABLE(user_id uuid, first_name text, last_name text, profile_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH team_users AS (
        -- Get all team members for the exercise's team
        SELECT 
            tm.user_id,
            tm.first_name,
            tm.last_name,
            COALESCE(tm.profile_name, tm.first_name || ' ' || tm.last_name) as profile_name
        FROM exercises e
        JOIN team_members tm ON e.team_id = tm.team_id
        WHERE e.id = p_exercise_id
    )
    SELECT 
        tu.user_id,
        tu.first_name,
        tu.last_name,
        tu.profile_name
    FROM team_users tu
    WHERE 
        CASE 
            WHEN p_status = 'writing' THEN
                -- Return users who haven't submitted their exercise data
                NOT EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id
                    AND ed.is_submitted = true
                )
            WHEN p_status = 'reviewing' THEN
                -- Return users who haven't reviewed their assigned exercise data
                NOT EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.reviewer_id = tu.user_id
                    AND ed.is_reviewed = true
                )
            ELSE
                -- For other statuses, return no users
                false
        END;
END;
$function$
;


