set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_exercise_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    team_member_count INT;
    submission_count INT;
BEGIN
    -- Immediate log to confirm trigger is firing
    RAISE LOG 'TRIGGER FIRED: exercise_data changed for exercise_id: %', NEW.exercise_id;
    
    -- Get team member count
    SELECT COUNT(*) INTO team_member_count
    FROM team_members tm
    JOIN exercises e ON e.team_id = tm.team_id
    WHERE e.id = NEW.exercise_id;
    
    RAISE LOG 'Team member count: %', team_member_count;
    
    -- Get submission count
    SELECT COUNT(*) INTO submission_count
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;
    
    RAISE LOG 'Submission count: %', submission_count;
    
    IF submission_count >= team_member_count THEN
        RAISE LOG 'Attempting to update exercise status to reviewing';
        
        UPDATE exercises
        SET status = 'reviewing'
        WHERE id = NEW.exercise_id
        AND status = 'writing';
        
        RAISE LOG 'Update completed';
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_completion: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

create policy "Enable trigger updates on exercises"
on "public"."exercises"
as permissive
for update
to public
using (true)
with check (true);



