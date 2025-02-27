set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.exercise_status_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only trigger when status changes from 'writing' to 'reviewing'
  IF (OLD.status = 'writing' AND NEW.status = 'reviewing') THEN
    PERFORM
      net.http_post(
        url := 'http://127.0.0.1:54321/functions/v1/notify-exercise-status',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object('exerciseId', NEW.id)
      );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in exercise_status_webhook: %', SQLERRM;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notification_push_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Only trigger when push_eligible is true
  IF (NEW.push_eligible = true) THEN
    PERFORM
      net.http_post(
        url := 'http://127.0.0.1:54321/functions/v1/send-web-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'user_id', NEW.user_id,
          'notification_id', NEW.id,
          'type', NEW.type,
          'data', NEW.data
        )
      );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in notification_push_webhook: %', SQLERRM;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.team_invitation_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id UUID;
  v_team_name TEXT;
  v_inviter_name TEXT;
BEGIN
  -- Get user ID from email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = NEW.email;
  
  -- Get team name
  SELECT name INTO v_team_name
  FROM teams
  WHERE id = NEW.team_id;
  
  -- Get inviter name
  SELECT first_name || ' ' || last_name INTO v_inviter_name
  FROM profiles
  WHERE id = NEW.invited_by;
  
  -- Only proceed if we found a user
  IF v_user_id IS NOT NULL THEN
    PERFORM
      net.http_post(
        url := 'http://127.0.0.1:54321/functions/v1/send-web-push',
        headers := jsonb_build_object(
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'type', 'team_invitation',
          'userId', v_user_id,
          'notification', jsonb_build_object(
            'team_name', v_team_name,
            'inviter_name', v_inviter_name,
            'invitation_id', NEW.id
          )
        )
      );
  END IF;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in team_invitation_webhook: %', SQLERRM;
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
        
        -- The webhook trigger will handle the notification
        -- No need to call the edge function directly here
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_completion: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

CREATE TRIGGER exercise_status_webhook_trigger AFTER UPDATE OF status ON public.exercises FOR EACH ROW EXECUTE FUNCTION exercise_status_webhook();

CREATE TRIGGER notification_push_insert_trigger AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION notification_push_webhook();

CREATE TRIGGER notification_push_update_trigger AFTER UPDATE OF push_eligible ON public.notifications FOR EACH ROW EXECUTE FUNCTION notification_push_webhook();

CREATE TRIGGER team_invitation_webhook_trigger AFTER INSERT ON public.team_invitations FOR EACH ROW EXECUTE FUNCTION team_invitation_webhook();


