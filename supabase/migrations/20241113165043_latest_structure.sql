set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_team_member_avatar()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Only proceed if avatar_url has changed
    IF OLD.avatar_url IS DISTINCT FROM NEW.avatar_url THEN
        UPDATE team_members
        SET avatar_url = NEW.avatar_url
        WHERE user_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER sync_team_member_avatar_changes AFTER UPDATE OF avatar_url ON public.profiles FOR EACH ROW EXECUTE FUNCTION sync_team_member_avatar();


