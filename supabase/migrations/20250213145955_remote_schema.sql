CREATE TRIGGER notify_exercise_status_change_trigger AFTER UPDATE OF status ON public.exercises FOR EACH ROW WHEN ((old.status IS DISTINCT FROM new.status)) EXECUTE FUNCTION notify_exercise_status_change();


