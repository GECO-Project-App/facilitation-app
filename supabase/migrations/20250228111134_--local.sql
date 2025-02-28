drop trigger if exists "mark_notification_sent_trigger" on "public"."notifications";

drop trigger if exists "notification_push_insert_trigger" on "public"."notifications";

drop trigger if exists "notification_push_update_trigger" on "public"."notifications";

drop trigger if exists "team_invitation_webhook_trigger" on "public"."team_invitations";

drop trigger if exists "notification_push_webhook" on "public"."notifications";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.send_notification_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only trigger when push_eligible is true
  IF (NEW.push_eligible = true) THEN
    PERFORM
      net.http_post(
        url := 'http://127.0.0.1:54321/functions/v1/send-web-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'user_id', NEW.user_id,
          'notification_id', NEW.id,
          'type', NEW.type,
          'data', NEW.data
        )
      );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in send_notification_webhook: %', SQLERRM;
  RETURN NEW;
END;
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
    -- and the notification hasn't been sent yet
    IF (user_preferences->>'push_enabled')::boolean = true 
    AND (user_preferences->'notifications'->>(NEW.type::text))::boolean = true
    AND (NEW.push_sent IS NULL OR NEW.push_sent = false) THEN
        -- Mark the notification as eligible for push notification
        UPDATE notifications
        SET push_eligible = true
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER notification_push_webhook AFTER INSERT OR UPDATE OF push_eligible ON public.notifications FOR EACH ROW WHEN (((new.push_eligible = true) AND (new.push_sent = false))) EXECUTE FUNCTION supabase_functions.http_request('http://127.0.0.1:54321/functions/v1/send-web-push', 'POST', '{"Content-type":"application/json","Authorization":" Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"}', '{"user_id": "{{user_id}}", "notification_id": "{{id}}", "type": "{{type}}", "data": {{data}}::text}', '5000');


