drop policy "team_members_select_policy" on "public"."team_members";

create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using (((user_id = auth.uid()) OR (team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid())))));



