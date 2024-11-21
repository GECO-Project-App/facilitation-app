alter table "public"."team_members" add column "profile_name" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_team_member_profile(p_team_id uuid, p_profile_name text DEFAULT NULL::text, p_description text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    updated_member json;
BEGIN
    UPDATE team_members
    SET 
        profile_name = COALESCE(p_profile_name, profile_name),
        description = COALESCE(p_description, description)
    WHERE team_id = p_team_id 
    AND user_id = auth.uid()
    RETURNING to_json(team_members.*) INTO updated_member;
    
    RETURN updated_member;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_team_member_profile_name(p_team_id uuid, p_profile_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE team_members
    SET profile_name = p_profile_name
    WHERE team_id = p_team_id 
    AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_team()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_team_code TEXT;
    user_profile RECORD;
    code_exists BOOLEAN;
BEGIN
    -- Generate unique team code loop
    LOOP
        new_team_code := upper(substring(encode(gen_random_bytes(3), 'hex') from 1 for 6));
        
        SELECT EXISTS (
            SELECT 1 FROM teams WHERE team_code = new_team_code
        ) INTO code_exists;
        
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    UPDATE teams 
    SET team_code = new_team_code 
    WHERE id = NEW.id;

    SELECT first_name, last_name, avatar_url 
    INTO user_profile 
    FROM profiles 
    WHERE id = NEW.created_by;

    INSERT INTO team_members (
        team_id,
        user_id,
        role,
        first_name,
        last_name,
        avatar_url,
        profile_name
    ) VALUES (
        NEW.id,
        NEW.created_by,
        'facilitator',
        user_profile.first_name,
        user_profile.last_name,
        user_profile.avatar_url,
        CONCAT(user_profile.first_name, ' ', user_profile.last_name)
    );

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.join_team_by_code(team_code_input text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_id_var uuid;
BEGIN
    SELECT id INTO team_id_var
    FROM teams
    WHERE team_code = team_code_input;

    IF team_id_var IS NOT NULL THEN
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
            auth.uid(),
            'member',
            p.first_name,
            p.last_name,
            p.avatar_url,
            CONCAT(p.first_name, ' ', p.last_name)
        FROM profiles p
        WHERE p.id = auth.uid()
        ON CONFLICT (team_id, user_id) DO NOTHING;
    END IF;

    RETURN team_id_var;
END;
$function$
;


