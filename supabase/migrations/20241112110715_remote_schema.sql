drop trigger if exists "refresh_team_permissions_on_member_change" on "public"."team_members";

drop trigger if exists "refresh_team_permissions_trigger" on "public"."team_members";

drop trigger if exists "refresh_team_permissions_on_team_change" on "public"."teams";

drop trigger if exists "refresh_team_permissions_trigger" on "public"."teams";

CREATE TRIGGER refresh_team_permissions_members AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_permissions();

CREATE TRIGGER refresh_team_permissions_teams AFTER INSERT OR DELETE OR UPDATE ON public.teams FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_permissions();


