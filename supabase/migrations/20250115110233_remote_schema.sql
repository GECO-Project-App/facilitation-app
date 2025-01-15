set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_team_exercise_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    team_size INT;
    submissions_count INT;
BEGIN
    -- Get total number of team members
    SELECT COUNT(*) INTO team_size
    FROM team_members
    WHERE team_id = NEW.team_id;
    
    -- Get number of submissions for this exercise
    SELECT COUNT(DISTINCT author_id) INTO submissions_count
    FROM exercise_data
    WHERE team_id = NEW.team_id
    AND exercise_id = NEW.exercise_id;
    
    -- If all team members have submitted, update exercise status
    IF submissions_count >= team_size THEN
        -- Update tutorial_to_me status to reviewing
        UPDATE tutorial_to_me
        SET 
            reviewing_date = CURRENT_DATE::text,
            reviewing_time = to_char(CURRENT_TIME, 'HH24:MI')
        WHERE exercise_id = NEW.exercise_id
        AND team_id = NEW.team_id;
        
        RAISE LOG 'Updated exercise % to reviewing status for team %', 
            NEW.exercise_id, NEW.team_id;
    END IF;
    
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER check_exercise_completion AFTER INSERT OR UPDATE ON public.exercise_data FOR EACH ROW EXECUTE FUNCTION check_team_exercise_completion();


