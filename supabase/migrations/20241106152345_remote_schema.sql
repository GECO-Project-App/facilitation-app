drop policy "team_members_insert_policy" on "public"."team_members";

create policy "teams_manage_policy"
on "public"."teams"
as permissive
for all
to public
using ((created_by = auth.uid()));


create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check (((auth.uid() IS NOT NULL) OR ( SELECT true
   FROM teams
  WHERE ((teams.id = team_members.team_id) AND (teams.created_by = team_members.user_id)))));



