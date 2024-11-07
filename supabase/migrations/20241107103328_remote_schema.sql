drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "teams_insert_policy" on "public"."teams";

drop policy "teams_select_policy" on "public"."teams";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_team_management_permission(team_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE team_members.team_id = $1
    AND team_members.user_id = $2
    AND team_members.role = 'facilitator'
  );
END;
$function$
;

create policy "team_members_delete_policy"
on "public"."team_members"
as permissive
for delete
to public
using (((user_id = auth.uid()) OR (team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid())))));


create policy "team_members_update_policy"
on "public"."team_members"
as permissive
for update
to public
using ((team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid()))))
with check ((team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid()))));


create policy "teams_delete_policy"
on "public"."teams"
as permissive
for delete
to public
using ((id IN ( SELECT team_members.team_id
   FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.role = 'facilitator'::team_role)))));


create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check (((user_id = auth.uid()) OR (team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid())))));


create policy "teams_insert_policy"
on "public"."teams"
as permissive
for insert
to public
with check ((auth.uid() = created_by));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using (((created_by = auth.uid()) OR (id IN ( SELECT team_members.team_id
   FROM team_members
  WHERE (team_members.user_id = auth.uid())))));



