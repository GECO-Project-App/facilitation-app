drop policy "Anyone can read invitations" on "public"."team_invitations";

drop policy "Team facilitators can create invitations" on "public"."team_invitations";

drop policy "Users can read their own invitations during signup" on "public"."team_invitations";

drop policy "Users can update their own invitation status" on "public"."team_invitations";

drop policy "Users can update their own invitations" on "public"."team_invitations";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.join_team_by_invitation(invitation_id uuid, user_id uuid)
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
    -- Log input parameters
    RAISE LOG 'join_team_by_invitation called with invitation_id: %, user_id: %', invitation_id, user_id;

    -- Get invitation with team_id and status
    SELECT 
        ti.*,
        u.email as user_email
    INTO v_invitation
    FROM team_invitations ti
    CROSS JOIN auth.users u
    WHERE ti.id = invitation_id 
    AND u.id = user_id
    AND ti.status IN ('awaiting_signup', 'pending');

    IF v_invitation IS NULL THEN
        RAISE LOG 'Invitation not found or invalid status: id=%, user=%', invitation_id, user_id;
        RETURN NULL;
    END IF;

    RAISE LOG 'Found invitation: %', to_json(v_invitation);

    -- Get profile info
    SELECT *
    INTO v_profile
    FROM profiles
    WHERE id = user_id;

    IF v_profile IS NULL THEN
        RAISE LOG 'Profile not found for user: %', user_id;
        RETURN NULL;
    END IF;

    RAISE LOG 'Found profile: %', to_json(v_profile);

    -- Check if already a member
    IF EXISTS (
        SELECT 1 
        FROM team_members 
        WHERE team_id = v_invitation.team_id 
        AND user_id = user_id
    ) THEN
        RAISE LOG 'User already a team member: team=%, user=%', v_invitation.team_id, user_id;
        RETURN NULL;
    END IF;

    -- Verify team exists
    IF NOT EXISTS (
        SELECT 1 
        FROM teams 
        WHERE id = v_invitation.team_id
    ) THEN
        RAISE LOG 'Team not found: %', v_invitation.team_id;
        RETURN NULL;
    END IF;

    -- Insert team member
    BEGIN
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
            user_id,
            'member',
            v_profile.first_name,
            v_profile.last_name,
            v_profile.avatar_url,
            COALESCE(v_profile.first_name || ' ' || v_profile.last_name, 'New Member')
        );
        
        RAISE LOG 'Successfully inserted team member';
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'Error inserting team member: %', SQLERRM;
        RETURN NULL;
    END;

    -- Update invitation status
    UPDATE team_invitations
    SET 
        status = 'accepted',
        accepted_at = now()
    WHERE id = invitation_id;

    RAISE LOG 'Successfully updated invitation status';

    RETURN v_invitation.team_id;

EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in join_team_by_invitation: %, invitation=%, user=%, details=%', 
        SQLERRM, 
        invitation_id,
        user_id,
        to_json(v_invitation);
    RETURN NULL;
END;
$function$
;

create policy "Facilitators create invitations"
on "public"."team_invitations"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invitations.team_id) AND (team_members.user_id = auth.uid()) AND (team_members.role = 'facilitator'::team_role)))));


create policy "Read invitations"
on "public"."team_invitations"
as permissive
for select
to public
using (((email = auth.email()) OR (EXISTS ( SELECT 1
   FROM team_members
  WHERE ((team_members.team_id = team_invitations.team_id) AND (team_members.user_id = auth.uid()))))));


create policy "Update own invitations"
on "public"."team_invitations"
as permissive
for update
to authenticated
using ((email = auth.email()));



