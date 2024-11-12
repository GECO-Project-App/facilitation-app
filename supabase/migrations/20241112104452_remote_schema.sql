drop trigger if exists "on_team_created" on "public"."teams";

CREATE TRIGGER on_team_created AFTER INSERT ON public.teams FOR EACH ROW EXECUTE FUNCTION handle_new_team();


