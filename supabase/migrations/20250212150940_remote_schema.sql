set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_deadline_notification(p_exercise_id uuid, p_deadline_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    v_team_members record;
    v_exercise record;
begin
    -- Get exercise details including slug
    select e.*, t.name as team_name
    into v_exercise
    from exercises e
    join teams t on t.id = e.team_id
    where e.id = p_exercise_id;

    -- Create notification for each team member
    for v_team_members in (
        select tm.user_id
        from team_members tm
        where tm.team_id = v_exercise.team_id
    )
    loop
        insert into notifications (user_id, type, data)
        values (
            v_team_members.user_id,
            'upcoming_deadline',
            jsonb_build_object(
                'exercise_id', p_exercise_id,
                'team_name', v_exercise.team_name,
                'deadline_type', p_deadline_type,
                'deadline_time', v_exercise.deadline->>p_deadline_type,
                'slug', v_exercise.slug  -- Added slug to the notification data
            )
        );
    end loop;
end;
$function$
;


