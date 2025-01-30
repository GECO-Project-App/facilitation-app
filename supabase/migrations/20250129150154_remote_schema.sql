set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.join_team_by_code(team_code_input text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_id_var uuid;
    v_profile record;
BEGIN
    -- Log the input and current user
    RAISE LOG 'Attempting to join team with code: %, user: %', team_code_input, auth.uid();

    -- Get team ID from code
    SELECT id INTO team_id_var
    FROM teams
    WHERE team_code = team_code_input;

    IF team_id_var IS NULL THEN
        RAISE EXCEPTION 'Invalid team code: %', team_code_input;
    END IF;

    RAISE LOG 'Found team ID: %', team_id_var;

    -- Get user profile
    SELECT *
    INTO v_profile
    FROM profiles
    WHERE id = auth.uid();

    IF v_profile IS NULL THEN
        RAISE EXCEPTION 'Profile not found for user: %', auth.uid();
    END IF;

    RAISE LOG 'Found profile for user: % % %', v_profile.first_name, v_profile.last_name, v_profile.id;

    -- Check if already a member
    IF EXISTS (
        SELECT 1 FROM team_members 
        WHERE team_id = team_id_var AND user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'User is already a member of this team';
    END IF;

    -- Insert team member with profile data
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
        team_id_var,
        auth.uid(),
        'member',
        COALESCE(v_profile.first_name, ''),
        COALESCE(v_profile.last_name, ''),
        COALESCE(v_profile.avatar_url, ''),
        COALESCE(NULLIF(CONCAT(v_profile.first_name, ' ', v_profile.last_name), ' '), 'Anonymous User')
    );

    RAISE LOG 'Successfully inserted team member';

    RETURN team_id_var;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in join_team_by_code: %', SQLERRM;
    RAISE EXCEPTION '%', SQLERRM;
END;
$function$
;


