set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_active_exercises()
 RETURNS TABLE(id uuid, team_id uuid, created_by uuid, created_at timestamp with time zone, status exercise_status, review_type exercise_review_type, deadline jsonb, slug text, team_name text, creator_name text)
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
        CONCAT(p.first_name, ' ', p.last_name) as creator_name
    FROM exercises e
    JOIN teams t ON e.team_id = t.id
    JOIN profiles p ON e.created_by = p.id
    -- Join with team_members to check if current user is part of the team
    JOIN team_members tm ON t.id = tm.team_id AND tm.user_id = auth.uid()
    WHERE (e.deadline->>'reviewing')::timestamptz > NOW()
    ORDER BY (e.deadline->>'reviewing')::timestamptz ASC;
END;
$function$
;


