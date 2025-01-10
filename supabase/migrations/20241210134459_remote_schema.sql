drop policy "Facilitators create invitations" on "public"."team_invitations";

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
    );
END;
$function$
;

create policy "Team members can create invitations"
on "public"."team_invitations"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invitations.team_id) AND (team_members.user_id = auth.uid())))));



