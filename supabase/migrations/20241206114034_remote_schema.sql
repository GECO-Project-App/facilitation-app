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
    AND ti.status = 'pending';

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
        COALESCE(v_profile.first_name || ' ' || v_profile.last_name, 'New Member')
    )
    ON CONFLICT (team_id, user_id) DO NOTHING;

    -- Update invitation status
    UPDATE team_invitations ti
    SET status = 'accepted'
    WHERE ti.id = invitation_id;

    RETURN v_invitation.team_id;
END;
$function$
;


