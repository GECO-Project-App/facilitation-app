set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_team_exercises()
 RETURNS TABLE(id uuid, team_id uuid, created_by uuid, created_at timestamp with time zone, status exercise_status, review_type exercise_review_type, deadline jsonb, slug text, team_name text, team_members jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.team_id,
        e.created_by,
        e.created_at,
        e.status,
        e.review_type,
        e.deadline,
        e.slug,
        t.name as team_name,
        tmv.team_members
    FROM exercises e
    INNER JOIN teams t ON e.team_id = t.id
    INNER JOIN team_members_view tmv ON e.team_id = tmv.team_id
    WHERE EXISTS (
        SELECT 1 
        FROM team_members tm 
        WHERE tm.team_id = e.team_id 
        AND tm.user_id = auth.uid()
    )
    AND (e.deadline->>'reviewing')::timestamptz > NOW() -- Only return exercises where reviewing deadline hasn't passed
    ORDER BY e.created_at DESC;
END;
$function$
;


