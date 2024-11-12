drop trigger if exists "refresh_team_permissions_members" on "public"."team_members";

drop trigger if exists "refresh_team_permissions_teams" on "public"."teams";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh_team_permissions()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Add a small delay to allow other transactions to complete
    PERFORM pg_sleep(0.1);
    
    BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY team_permissions;
    EXCEPTION WHEN OTHERS THEN
        -- If concurrent refresh fails, try normal refresh
        BEGIN
            REFRESH MATERIALIZED VIEW team_permissions;
        EXCEPTION WHEN OTHERS THEN
            -- Log error but don't fail the transaction
            RAISE NOTICE 'Failed to refresh team_permissions: %', SQLERRM;
        END;
    END;
    RETURN NULL;
END;
$function$
;

CREATE TRIGGER refresh_team_permissions_members AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION refresh_team_permissions();

CREATE TRIGGER refresh_team_permissions_teams AFTER INSERT OR DELETE OR UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION refresh_team_permissions();


