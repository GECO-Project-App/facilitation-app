drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.team_id = team_members.team_id) AND (tm.user_id = auth.uid()))))));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using ((created_by = auth.uid()));



