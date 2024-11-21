drop trigger if exists "sync_team_member_avatar_changes" on "public"."profiles";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_profile_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Update all relevant fields in team_members when profile is updated
    UPDATE team_members
    SET 
        first_name = NEW.first_name,
        last_name = NEW.last_name,
        avatar_url = NEW.avatar_url
    WHERE user_id = NEW.id;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER sync_profile_changes AFTER UPDATE OF first_name, last_name, avatar_url ON public.profiles FOR EACH ROW EXECUTE FUNCTION sync_profile_changes();


