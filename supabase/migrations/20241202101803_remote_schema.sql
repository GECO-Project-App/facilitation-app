create policy "Enable insert for authenticated users only"
on "public"."team_invitations"
as permissive
for insert
to authenticated
with check (true);


create policy "Team facilitators can manage invitations"
on "public"."team_invitations"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.team_id = team_invitations.team_id) AND (tm.user_id = auth.uid()) AND (tm.role = 'facilitator'::team_role)))));


create policy "Users can view their own invitations"
on "public"."team_invitations"
as permissive
for select
to authenticated
using (((email = auth.email()) OR (EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.team_id = team_invitations.team_id) AND (tm.user_id = auth.uid()))))));



