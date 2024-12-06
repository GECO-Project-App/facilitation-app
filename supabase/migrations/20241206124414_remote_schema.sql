drop function if exists "public"."join_team_by_invitation"(invitation_id uuid, user_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.join_team_by_invitation(invitation_id uuid, p_user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_team_id uuid;
    v_invitation record;
    v_profile record;
BEGIN
    -- Get invitation details
    SELECT *
    INTO v_invitation
    FROM team_invitations ti
    WHERE ti.id = invitation_id 
    AND ti.status IN ('awaiting_signup', 'pending');

    IF v_invitation IS NULL THEN
        RAISE EXCEPTION 'Invalid invitation';
    END IF;

    -- Get profile
    SELECT *
    INTO v_profile
    FROM profiles p
    WHERE p.id = p_user_id;

    IF v_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    -- Check if user is already a member
    IF EXISTS (
        SELECT 1 FROM team_members tm
        WHERE tm.team_id = v_invitation.team_id 
        AND tm.user_id = p_user_id
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
    VALUES (
        v_invitation.team_id,
        p_user_id,
        'member',
        v_profile.first_name,
        v_profile.last_name,
        v_profile.avatar_url,
        CONCAT(v_profile.first_name, ' ', v_profile.last_name)
    );

    -- Update invitation status
    UPDATE team_invitations
    SET status = 'accepted'
    WHERE id = invitation_id;

    RETURN v_invitation.team_id;
END;
$function$
;


