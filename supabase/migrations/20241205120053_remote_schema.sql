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
    AND status IN ('awaiting_signup'::team_invitation_status, 'pending'::team_invitation_status);

    IF team_id_var IS NOT NULL THEN
        -- Insert team member with profile info
        WITH new_member AS (
            SELECT 
                team_id_var as team_id,
                $2 as user_id,
                'member'::team_role as role,  -- Cast to team_role enum
                p.first_name,
                p.last_name,
                p.avatar_url,
                CONCAT(p.first_name, ' ', p.last_name) as profile_name
            FROM profiles p
            WHERE p.id = $2
        )
        INSERT INTO team_members (
            team_id,
            user_id,
            role,
            first_name,
            last_name,
            avatar_url,
            profile_name
        )
        SELECT * FROM new_member
        ON CONFLICT ON CONSTRAINT team_members_pkey DO NOTHING;

        -- Update invitation status
        UPDATE team_invitations
        SET status = 'accepted'::team_invitation_status
        WHERE id = invitation_id;
    END IF;

    RETURN team_id_var;
END;
$function$
;


