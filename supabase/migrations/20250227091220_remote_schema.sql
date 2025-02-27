alter table "public"."notifications" add column "push_eligible" boolean default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_team_invitation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    v_team_name text;
    v_inviter_name text;
    v_user_id uuid;
begin
    -- Get user id from email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = NEW.email;

    -- Get team name and inviter name
    SELECT t.name, concat(p.first_name, ' ', p.last_name)
    INTO v_team_name, v_inviter_name
    FROM teams t
    JOIN profiles p on p.id = NEW.invited_by
    WHERE t.id = NEW.team_id;

    -- Only create notification if user exists
    IF v_user_id IS NOT NULL THEN
        -- Create notification with invitation_id
        perform create_team_invitation_notification(
            v_user_id,
            NEW.team_id,
            v_team_name,
            v_inviter_name,
            NEW.id
        );
    END IF;
    
    return NEW;
exception when others then
    RAISE LOG 'Error in handle_team_invitation: %', SQLERRM;
    return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.send_web_push_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_preferences jsonb;
BEGIN
    -- Get user's notification preferences
    SELECT notification_preferences INTO user_preferences
    FROM profiles 
    WHERE id = NEW.user_id;

    -- Only proceed if push notifications are enabled and the notification type is enabled
    IF (user_preferences->>'push_enabled')::boolean = true 
    AND (user_preferences->'notifications'->>(NEW.type::text))::boolean = true THEN
        -- Mark the notification as eligible for push notification
        -- This flag can be used by the webhook to determine which notifications to process
        UPDATE notifications
        SET push_eligible = true
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER notification_push_webhook AFTER INSERT OR UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://rkfeakwmyoqtruwyeetl.supabase.co/functions/v1/send-web-push', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZmVha3dteW9xdHJ1d3llZXRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjA5OTQwMiwiZXhwIjoyMDQ3Njc1NDAyfQ.IFazA68Ju9ylPSO5hu2whsbBDUb9YLbrQIElvVSr8GU"}', '{"push_eligible":"true"}', '5000');


