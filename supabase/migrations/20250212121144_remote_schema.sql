drop function if exists "public"."create_team_invitation_notification"(p_user_id uuid, p_team_id uuid, p_team_name text, p_inviter_name text, p_invitation_id uuid);

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
            'invitation_id', p_invitation_id
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
    v_user_id uuid;
begin
    -- Get user id from email
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = NEW.email;

    -- Get team name and inviter name
    SELECT t.name, concat(p.first_name, ' ', p.last_name)
    INTO v_team_name, v_inviter_name
    FROM teams t
    JOIN profiles p on p.id = NEW.invited_by
    WHERE t.id = NEW.team_id;

    -- Only create notification if user exists
    IF v_user_id IS NOT NULL THEN
        -- Create notification with invitation_id
        perform create_team_invitation_notification(
            v_user_id,
            NEW.team_id,
            v_team_name,
            v_inviter_name,
            NEW.id  -- Pass the invitation_id from the newly created invitation
        );
    END IF;
    
    return NEW;
end;
$function$
;


