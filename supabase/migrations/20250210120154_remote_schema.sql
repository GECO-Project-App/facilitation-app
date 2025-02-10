set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh_team_members_view()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_members_view;
    RETURN NULL;
END;
$function$
;


