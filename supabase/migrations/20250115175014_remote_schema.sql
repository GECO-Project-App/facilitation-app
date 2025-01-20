set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_exercise_completion()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    team_member_count INT;
    submission_count INT;
    current_status TEXT;
BEGIN
    -- Get current exercise status
    SELECT status INTO current_status
    FROM exercises
    WHERE id = NEW.exercise_id;
    
    RAISE LOG 'Starting check_exercise_completion for exercise: %, current status: %', NEW.exercise_id, current_status;
    
    -- Only proceed if status is 'writing'
    IF current_status != 'writing' THEN
        RAISE LOG 'Exercise not in writing status, skipping';
        RETURN NEW;
    END IF;

    -- Get team member count
    SELECT COUNT(*) INTO team_member_count
    FROM team_members
    WHERE team_id = (
        SELECT team_id 
        FROM exercises 
        WHERE id = NEW.exercise_id
    );
    
    -- Get submission count
    SELECT COUNT(*) INTO submission_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;
    
    RAISE LOG 'Team members: %, Submissions: %', team_member_count, submission_count;
    
    -- Update status if conditions met
    IF submission_count >= team_member_count THEN
        UPDATE exercises
        SET status = 'reviewing'
        WHERE id = NEW.exercise_id
        AND status = 'writing';
        
        RAISE LOG 'Updated exercise % status to reviewing', NEW.exercise_id;
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_completion: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER update_exercise_status AFTER INSERT OR UPDATE ON public.exercise_data FOR EACH ROW EXECUTE FUNCTION check_exercise_completion();


