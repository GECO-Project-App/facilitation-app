drop policy "team_members_delete_policy" on "public"."team_members";

drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

drop policy "team_members_update_policy" on "public"."team_members";

create policy "team_members_delete_policy"
on "public"."team_members"
as permissive
for delete
to public
using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM team_members team_members_1
  WHERE ((team_members_1.team_id = team_members_1.team_id) AND (team_members_1.user_id = auth.uid()) AND (team_members_1.role = 'facilitator'::team_role))))));


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
using ((team_id IN ( SELECT team_members_1.team_id
   FROM team_members team_members_1
  WHERE (team_members_1.user_id = auth.uid()))));


create policy "team_members_update_policy"
on "public"."team_members"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM team_members team_members_1
  WHERE ((team_members_1.team_id = team_members_1.team_id) AND (team_members_1.user_id = auth.uid()) AND (team_members_1.role = 'facilitator'::team_role)))));



