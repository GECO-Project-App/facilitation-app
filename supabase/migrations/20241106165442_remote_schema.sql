drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));



