set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_new_exercise_notification(p_exercise_id uuid)
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

    -- Create notification for each team member except creator
    for v_team_members in (
        select tm.user_id
        from team_members tm
        where tm.team_id = v_exercise.team_id
        and tm.user_id != v_exercise.created_by
    )
    loop
        insert into notifications (user_id, type, data)
        values (
            v_team_members.user_id,
            'new_exercise',
            jsonb_build_object(
                'exercise_id', p_exercise_id,
                'team_name', v_exercise.team_name,
                'slug', v_exercise.slug  -- Added slug to the notification data
            )
        );
    end loop;
end;
$function$
;


