set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.join_team_by_invitation(invitation_id uuid, user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    team_id_var uuid;
    invitation_record record;
BEGIN
    -- Get invitation details with more information for debugging
    SELECT 
        ti.team_id,
        ti.email,
        ti.status,
        u.email as user_email
    INTO invitation_record
    FROM team_invitations ti
    CROSS JOIN auth.users u
    WHERE ti.id = invitation_id 
    AND u.id = user_id
    AND ti.status IN ('awaiting_signup', 'pending');

    IF invitation_record IS NULL THEN
        RAISE EXCEPTION 'Invalid invitation or status: id=%, status=%', 
            invitation_id, 
            (SELECT status FROM team_invitations WHERE id = invitation_id);
    END IF;

    -- Store team_id for return
    team_id_var := invitation_record.team_id;

    -- Check if user is already a member
    IF EXISTS (
        SELECT 1 FROM team_members 
        WHERE team_id = team_id_var 
        AND user_id = user_id
    ) THEN
        RAISE EXCEPTION 'User is already a team member';
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
        team_id_var,
        user_id,
        'member'::team_role,
        p.first_name,
        p.last_name,
        p.avatar_url,
        COALESCE(p.first_name || ' ' || p.last_name, 'New Member')
    FROM profiles p
    WHERE p.id = user_id;

    -- Update invitation status
    UPDATE team_invitations
    SET status = 'accepted'::team_invitation_status
    WHERE id = invitation_id;

    RETURN team_id_var;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error details
        RAISE LOG 'Error in join_team_by_invitation: %, invitation_id=%, user_id=%, email=%, status=%', 
            SQLERRM, 
            invitation_id, 
            user_id,
            invitation_record.email,
            invitation_record.status;
        RETURN NULL;
END;
$function$
;

create policy "Anyone can read invitations"
on "public"."team_invitations"
as permissive
for select
to public
using (true);


create policy "Team facilitators can create invitations"
on "public"."team_invitations"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invitations.team_id) AND (team_members.user_id = auth.uid()) AND (team_members.role = 'facilitator'::team_role)))));


create policy "Users can update their own invitations"
on "public"."team_invitations"
as permissive
for update
to authenticated
using ((email = auth.email()))
with check ((status = 'accepted'::team_invitation_status));



