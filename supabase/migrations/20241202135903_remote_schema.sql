set check_function_bodies = off;

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
    AND status = 'awaiting_signup'::team_invitation_status;

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
            user_id,
            'member',
            p.first_name,
            p.last_name,
            p.avatar_url,
            CONCAT(p.first_name, ' ', p.last_name)
        FROM profiles p
        WHERE p.id = user_id;

        -- Update invitation status
        UPDATE team_invitations
        SET status = 'accepted'::team_invitation_status
        WHERE id = invitation_id;
    END IF;

    RETURN team_id_var;
END;
$function$
;


