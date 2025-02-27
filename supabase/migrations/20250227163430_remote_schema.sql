drop trigger if exists "notification_push_webhook" on "public"."notifications";

alter table "public"."notifications" add column "push_sent" boolean default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.mark_notification_for_push(p_notification_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    UPDATE notifications
    SET push_eligible = true,
        push_sent = false
    WHERE id = p_notification_id
    AND user_id = auth.uid();
    
    RETURN FOUND;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.mark_notification_sent()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Mark the notification as sent
    UPDATE notifications
    SET push_sent = true
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER mark_notification_sent_trigger AFTER INSERT OR UPDATE ON public.notifications FOR EACH ROW WHEN (((new.push_eligible = true) AND ((new.push_sent IS NULL) OR (new.push_sent = false)))) EXECUTE FUNCTION mark_notification_sent();

CREATE TRIGGER notification_push_webhook AFTER INSERT OR UPDATE ON public.notifications FOR EACH ROW WHEN (((new.push_eligible = true) AND ((new.push_sent IS NULL) OR (new.push_sent = false)))) EXECUTE FUNCTION supabase_functions.http_request('https://your-project-ref.supabase.co/functions/v1/send-web-push', 'POST', '{"Content-type":"application/json","Authorization":" Bearer your-service-role-key"}', '{"user_id": "{{user_id}}", "notification_id": "{{id}}", "type": "{{type}}", "data": {{data}}::text}', '5000');


