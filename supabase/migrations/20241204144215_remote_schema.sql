set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.join_team_by_invitation(invitation_id uuid, p_user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_id_var uuid;
    invitation_record RECORD;
BEGIN
    -- Get and validate invitation
    SELECT team_id, status, email
    INTO invitation_record
    FROM team_invitations
    WHERE id = invitation_id 
    AND status IN ('pending', 'awaiting_signup')
    AND expires_at > now();

    IF invitation_record IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired invitation';
    END IF;

    -- Verify email matches
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = p_user_id 
        AND email = invitation_record.email
    ) THEN
        RAISE EXCEPTION 'Email mismatch';
    END IF;

    -- Insert team member
    INSERT INTO team_members (
        team_id,
        user_id,
        role,
        first_name,
        last_name,
        avatar_url,
        profile_name
    )
    SELECT 
        invitation_record.team_id,
        p_user_id,
        'member',
        p.first_name,
        p.last_name,
        p.avatar_url,
        CONCAT(p.first_name, ' ', p.last_name)
    FROM profiles p
    WHERE p.id = p_user_id
    ON CONFLICT (team_id, user_id) DO NOTHING;

    -- Update invitation status
    UPDATE team_invitations
    SET status = 'accepted'
    WHERE id = invitation_id;

    RETURN invitation_record.team_id;
END;
$function$
;

create policy "accept_own_invitations"
on "public"."team_invitations"
as permissive
for update
to authenticated
using ((email = auth.email()))
with check ((email = auth.email()));


create policy "view_own_invitations"
on "public"."team_invitations"
as permissive
for select
to authenticated
using (((email = auth.email()) OR (EXISTS ( SELECT 1
   FROM team_members tm
  WHERE ((tm.team_id = team_invitations.team_id) AND (tm.user_id = auth.uid()))))));



