set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_exercise_reviews_completion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    all_reviewed boolean;
BEGIN
    -- Check if all exercise_data entries for this exercise are reviewed
    SELECT bool_and(is_reviewed)
    INTO all_reviewed
    FROM exercise_data
    WHERE exercise_id = NEW.exercise_id;

    -- If all are reviewed, update exercise status to completed
    IF all_reviewed THEN
        UPDATE exercises
        SET status = 'completed'
        WHERE id = NEW.exercise_id
        AND status = 'reviewing';
    END IF;

    RETURN NEW;
END;
$function$
;

CREATE TRIGGER check_exercise_reviews_completion_trigger AFTER UPDATE OF is_reviewed ON public.exercise_data FOR EACH ROW WHEN ((new.is_reviewed = true)) EXECUTE FUNCTION check_exercise_reviews_completion();


