set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_team()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Set team_code if not provided
    IF NEW.team_code IS NULL THEN
        UPDATE teams 
        SET team_code = upper(substring(md5(random()::text) from 1 for 6))
        WHERE id = NEW.id;
    END IF;

    -- Insert the creator as a facilitator with their profile info
    INSERT INTO team_members (
        team_id, 
        user_id, 
        role,
        first_name,
        last_name,
        avatar_url
    )
    SELECT 
        NEW.id,
        NEW.created_by,
        'facilitator',
        profiles.first_name,
        profiles.last_name,
        profiles.avatar_url
    FROM profiles
    WHERE profiles.id = NEW.created_by;

    RETURN NEW;
END;
$function$
;


