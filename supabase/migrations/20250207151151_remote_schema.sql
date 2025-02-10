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
    ORDER BY e.created_at DESC;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.refresh_team_members_view()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_members_view;
    RETURN NULL;
END;
$function$
;

create materialized view "public"."team_members_view" as  SELECT team_members.team_id,
    jsonb_agg(jsonb_build_object('user_id', team_members.user_id, 'first_name', team_members.first_name, 'last_name', team_members.last_name, 'profile_name', team_members.profile_name, 'avatar_url', team_members.avatar_url, 'role', team_members.role)) AS team_members
   FROM team_members
  GROUP BY team_members.team_id;


CREATE INDEX idx_team_members_view_team_id ON public.team_members_view USING btree (team_id);

CREATE TRIGGER refresh_team_members_view_trigger AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_members_view();


