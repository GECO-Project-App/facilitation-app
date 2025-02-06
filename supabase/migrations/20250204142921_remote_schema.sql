set check_function_bodies = off;
-- Enable pg_cron extension

create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;


CREATE OR REPLACE FUNCTION public.schedule_deadline_check(
    exercise_id uuid,
    deadline_time timestamp with time zone,
    new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    job_name text;
    schedule_time text;
BEGIN
    -- Create unique job name
    job_name := 'deadline_' || exercise_id::text;
    
    -- Extract minute and hour for cron schedule
    schedule_time := format('%s %s * * *', 
        extract(minute from deadline_time)::text,
        extract(hour from deadline_time)::text
    );

    -- Remove existing job if it exists
    PERFORM extensions.cron.unschedule(job_name);

    -- Schedule the one-time update with proper quoting
    PERFORM extensions.cron.schedule(
        job_name,
        schedule_time,
        format(
            'UPDATE exercises SET status = %L WHERE id = %L AND status != %L; SELECT extensions.cron.unschedule(%L);',
            new_status,
            exercise_id,
            new_status,
            job_name
        )
    );
END;
$function$;

