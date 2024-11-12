CREATE UNIQUE INDEX team_permissions_unique_idx ON public.team_permissions USING btree (team_id, user_id);

CREATE TRIGGER refresh_team_permissions_trigger AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_permissions();

CREATE TRIGGER refresh_team_permissions_trigger AFTER INSERT OR DELETE OR UPDATE ON public.teams FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_permissions();


