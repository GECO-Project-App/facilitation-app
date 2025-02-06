set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.notify_exercise_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Only notify when status changes to 'reviewing'
    IF NEW.status = 'reviewing' AND OLD.status = 'writing' THEN
        PERFORM
            net.http_post(
                url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/notify-exercise-status'),
                headers := jsonb_build_object(
                    'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                    'Content-Type', 'application/json'
                ),
                body := jsonb_build_object('exerciseId', NEW.id)
            );
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Log error but don't prevent the status change
    RAISE LOG 'Error in notify_exercise_status_change: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_exercise_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_member_count INT;
    submission_count INT;
BEGIN
    -- Get team member count
    SELECT COUNT(*) INTO team_member_count
    FROM team_members tm
    JOIN exercises e ON e.team_id = tm.team_id
    WHERE e.id = NEW.exercise_id;
    
    -- Get submission count
    SELECT COUNT(*) INTO submission_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;
    
    IF submission_count >= team_member_count THEN
        UPDATE exercises
        SET status = 'reviewing'
        WHERE id = NEW.exercise_id
        AND status = 'writing';
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER notify_status_change AFTER UPDATE OF status ON public.exercises FOR EACH ROW EXECUTE FUNCTION notify_exercise_status_change();


