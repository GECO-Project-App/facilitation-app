set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_team_member_profile(p_team_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    profile_exists boolean;
BEGIN
    -- Check if profile exists and has required data
    SELECT EXISTS (
        SELECT 1 
        FROM profiles p 
        WHERE p.id = p_user_id 
        AND p.first_name IS NOT NULL 
        AND p.last_name IS NOT NULL
    ) INTO profile_exists;

    IF NOT profile_exists THEN
        RETURN false;
    END IF;

    -- Update team member with latest profile info
    UPDATE team_members tm
    SET 
        first_name = p.first_name,
        last_name = p.last_name,
        avatar_url = p.avatar_url,
        profile_name = CONCAT(p.first_name, ' ', p.last_name)
    FROM profiles p
    WHERE p.id = p_user_id
    AND tm.user_id = p_user_id
    AND tm.team_id = p_team_id;

    RETURN true;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.join_team_by_invitation(invitation_id uuid, user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_id_var uuid;
BEGIN
    -- Get and validate invitation
    SELECT team_id INTO team_id_var
    FROM team_invitations
    WHERE id = invitation_id 
    AND status IN ('awaiting_signup'::team_invitation_status, 'pending'::team_invitation_status);

    IF team_id_var IS NOT NULL THEN
        -- Insert team member with profile info
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
            $2,  -- Use the parameter reference instead of user_id
            'member',
            p.first_name,
            p.last_name,
            p.avatar_url,
            CONCAT(p.first_name, ' ', p.last_name)
        FROM profiles p
        WHERE p.id = $2  -- Use the parameter reference instead of user_id
        ON CONFLICT (team_id, user_id) DO NOTHING;

        -- Update invitation status
        UPDATE team_invitations
        SET status = 'accepted'::team_invitation_status
        WHERE id = invitation_id;
    END IF;

    RETURN team_id_var;
END;
$function$
;


