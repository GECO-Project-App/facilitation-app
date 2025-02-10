create extension if not exists "http" with schema "extensions";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_email(user_id uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN (
        SELECT email 
        FROM auth.users 
        WHERE id = user_id
    );
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
    status_changed BOOLEAN;
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
        AND status = 'writing'
        RETURNING (xmax = 0) INTO status_changed;
        
        -- If status was changed to reviewing, call the edge function
        IF status_changed THEN
            PERFORM
                net.http_post(
                    url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/notify-exercise-status'),
                    headers := jsonb_build_object(
                        'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                        'Content-Type', 'application/json'
                    ),
                    body := jsonb_build_object('exerciseId', NEW.exercise_id)
                );
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_completion: %', SQLERRM;
    RETURN NEW;
END;
$function$
;


