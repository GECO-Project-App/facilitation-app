drop trigger if exists "refresh_team_permissions_members" on "public"."team_members";

drop trigger if exists "refresh_team_permissions_teams" on "public"."teams";

drop index if exists "public"."idx_team_permissions";

drop index if exists "public"."team_permissions_unique_idx";

drop materialized view if exists "public"."team_permissions";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh_team_permissions()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_permissions;
    RETURN NULL;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$function$
;

create materialized view "public"."team_permissions" as  SELECT DISTINCT tm.team_id,
    tm.user_id
   FROM team_members tm;



