drop policy "teams_access_policy" on "public"."teams";

create policy "teams_access_policy"
on "public"."teams"
as permissive
for all
to authenticated
using (((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.team_id = teams.id) AND (tm.user_id = auth.uid())))) OR (team_code IS NOT NULL)));



