drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM teams
  WHERE ((teams.id = team_members.team_id) AND (teams.created_by = auth.uid()))))));


create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using (((user_id = auth.uid()) OR (team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid()))) OR (team_id IN ( SELECT team_members_1.team_id
   FROM team_members team_members_1
  WHERE (team_members_1.user_id = auth.uid())))));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using (((created_by = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = teams.id) AND (team_members.user_id = auth.uid()))))));



