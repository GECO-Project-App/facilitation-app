drop trigger if exists "notify_exercise_status_change_trigger" on "public"."exercises";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_exercise_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Create notifications in the database
    PERFORM create_exercise_status_notification(NEW.id);
    
    -- Call the edge function to send emails
    PERFORM
        net.http_post(
            url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/notify-exercise-status'),
            headers := jsonb_build_object(
                'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                'Content-Type', 'application/json'
            ),
            body := jsonb_build_object('exerciseId', NEW.id)
        );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in handle_exercise_status_change: %', SQLERRM;
    RETURN NEW;
END;
$function$
;


