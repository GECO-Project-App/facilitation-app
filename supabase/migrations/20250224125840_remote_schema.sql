set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_exercise_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_member_count INT;
    submission_count INT;
    deadline_time timestamptz;
BEGIN
    -- Get writing deadline
    SELECT (deadline->>'writing')::timestamptz INTO deadline_time
    FROM exercises
    WHERE id = NEW.exercise_id;

    -- Only proceed if we're still within the writing deadline
    IF NOW() <= deadline_time THEN
        -- Get team member count for this specific exercise's team
        SELECT COUNT(*) INTO team_member_count
        FROM exercises e
        JOIN team_members tm ON tm.team_id = e.team_id
        WHERE e.id = NEW.exercise_id;
        
        -- Get submission count
        SELECT COUNT(*) INTO submission_count
        FROM exercise_data
        WHERE exercise_id = NEW.exercise_id;
        
        -- Only update status if ALL team members have submitted
        IF submission_count = team_member_count THEN
            UPDATE exercises
            SET status = 'reviewing'
            WHERE id = NEW.exercise_id
            AND status = 'writing';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$
;


