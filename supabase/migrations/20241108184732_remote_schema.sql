drop policy "team_members_select_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using (((user_id = auth.uid()) OR (team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid())))));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using (((created_by = auth.uid()) OR (id IN ( SELECT team_members.team_id
   FROM team_members
  WHERE (team_members.user_id = auth.uid())))));



