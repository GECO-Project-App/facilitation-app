drop policy "team_members_access_policy" on "public"."team_members";

drop policy "teams_access_policy" on "public"."teams";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh_team_permissions()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY team_permissions;
    RETURN NULL;
END;
$function$
;

CREATE UNIQUE INDEX team_permissions_idx ON public.team_permissions USING btree (team_id, user_id);

create policy "team_members_access_policy"
on "public"."team_members"
as permissive
for all
to authenticated
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_permissions tp
  WHERE ((tp.team_id = team_members.team_id) AND (tp.user_id = auth.uid()))))));


create policy "teams_access_policy"
on "public"."teams"
as permissive
for all
to authenticated
using (((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_permissions tp
  WHERE ((tp.team_id = teams.id) AND (tp.user_id = auth.uid())))) OR (team_code IS NOT NULL)));


CREATE TRIGGER refresh_team_permissions_on_member_change AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_permissions();


