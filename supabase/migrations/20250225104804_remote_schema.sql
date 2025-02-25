set check_function_bodies = off;

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
            NEW.id
        );

        -- Call the Edge Function for web push notification
        PERFORM
            net.http_post(
                url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/send-web-push'),
                headers := jsonb_build_object(
                    'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                    'Content-Type', 'application/json'
                ),
                body := jsonb_build_object(
                    'userId', v_user_id,
                    'notification', jsonb_build_object(
                        'team_name', v_team_name,
                        'inviter_name', v_inviter_name
                    ),
                    'type', 'team_invitation'
                )
            );
    END IF;
    
    return NEW;
exception when others then
    RAISE LOG 'Error in handle_team_invitation: %', SQLERRM;
    return NEW;
end;
$function$
;


