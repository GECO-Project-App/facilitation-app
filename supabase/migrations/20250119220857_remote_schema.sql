set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_pending_users(p_exercise_id uuid, p_status exercise_status)
 RETURNS TABLE(user_id uuid, first_name text, last_name text, profile_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    WITH team_users AS (
        SELECT 
            tm.user_id,
            tm.first_name,
            tm.last_name,
            tm.profile_name
        FROM exercises e
        JOIN team_members tm ON e.team_id = tm.team_id
        WHERE e.id = p_exercise_id
    ),
    current_user_submitted AS (
        SELECT EXISTS (
            SELECT 1 
            FROM exercise_data ed 
            WHERE ed.exercise_id = p_exercise_id 
            AND ed.author_id = auth.uid()
        ) as has_submitted
    )
    SELECT 
        tu.user_id,
        tu.first_name,
        tu.last_name,
        tu.profile_name
    FROM team_users tu
    CROSS JOIN current_user_submitted cus
    WHERE 
        CASE 
            WHEN p_status = 'writing' THEN
                -- Return pending users only if current user has submitted
                cus.has_submitted = true
                AND tu.user_id != auth.uid()
                AND NOT EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id
                )
            WHEN p_status = 'reviewing' THEN
                EXISTS (
                    SELECT 1 FROM exercise_data ed 
                    WHERE ed.exercise_id = p_exercise_id 
                    AND ed.author_id = tu.user_id
                    AND ed.is_reviewed = false
                )
            ELSE
                false
        END;
END;
$function$
;


