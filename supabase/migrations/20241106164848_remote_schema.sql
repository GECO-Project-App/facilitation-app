drop policy "team_members_select_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using (((auth.uid() = user_id) OR (team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid())))));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using (((auth.uid() = created_by) OR (EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = teams.id) AND (team_members.user_id = auth.uid()))))));



