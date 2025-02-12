
CREATE OR REPLACE FUNCTION public.check_exercise_deadlines()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    next_hour timestamptz := date_trunc('hour', NOW()) + interval '1 hour';
    r RECORD;  -- Add this declaration for the loop variable
BEGIN
    -- Log start of execution
    RAISE LOG 'Starting exercise deadline check at %', NOW();

    -- Schedule precise deadline checks for writing -> reviewing
    FOR r IN (
        SELECT id, (deadline->>'writing')::timestamptz as deadline_time
        FROM exercises
        WHERE status = 'writing'
        AND (deadline->>'writing')::timestamptz < next_hour
        AND (deadline->>'writing')::timestamptz > NOW()
    ) LOOP
        PERFORM public.schedule_deadline_check(r.id, r.deadline_time, 'reviewing');
    END LOOP;

    -- Schedule precise deadline checks for reviewing -> completed
    FOR r IN (
        SELECT id, (deadline->>'reviewing')::timestamptz as deadline_time
        FROM exercises
        WHERE status = 'reviewing'
        AND (deadline->>'reviewing')::timestamptz < next_hour
        AND (deadline->>'reviewing')::timestamptz > NOW()
    ) LOOP
        PERFORM public.schedule_deadline_check(r.id, r.deadline_time, 'completed');
    END LOOP;

    -- Handle any overdue deadlines immediately
    UPDATE exercises
    SET status = 'reviewing'
    WHERE status = 'writing'
    AND (deadline->>'writing')::timestamptz <= NOW();

    UPDATE exercises
    SET status = 'completed'
    WHERE status = 'reviewing'
    AND (deadline->>'reviewing')::timestamptz <= NOW();

    RAISE LOG 'Completed exercise deadline check at %', NOW();
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in check_exercise_deadlines: %', SQLERRM;
END;
$function$
;

select cron.schedule('30-minutes-deadline-check', '0,30 * * * *', 'SELECT public.check_exercise_deadlines()');


