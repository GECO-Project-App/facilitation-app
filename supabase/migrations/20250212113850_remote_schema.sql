set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_team_invitation_notification(p_user_id uuid, p_team_id uuid, p_team_name text, p_inviter_name text, p_invitation_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    insert into notifications (user_id, type, data)
    values (
        p_user_id,
        'team_invitation',
        jsonb_build_object(
            'team_id', p_team_id,
            'team_name', p_team_name,
            'inviter_name', p_inviter_name,
            'invitation_id', p_invitation_id  -- Add invitation_id to the JSON data
        )
    );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_team_invitation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    v_team_name text;
    v_inviter_name text;
begin
    -- Get team name and inviter name
    select t.name, concat(p.first_name, ' ', p.last_name)
    into v_team_name, v_inviter_name
    from teams t
    join profiles p on p.id = NEW.invited_by
    where t.id = NEW.team_id;

    -- Create notification with invitation_id
    perform create_team_invitation_notification(
        (select id from auth.users where email = NEW.email),
        NEW.team_id,
        v_team_name,
        v_inviter_name,
        NEW.id  -- Pass the invitation_id
    );
    
    return NEW;
end;
$function$
;


