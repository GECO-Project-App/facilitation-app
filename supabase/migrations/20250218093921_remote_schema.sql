alter table "public"."profiles" add column "notification_preferences" jsonb not null default jsonb_build_object('push_enabled', true, 'notifications', jsonb_build_object('team_invitation', true, 'exercise_status_change', true, 'new_exercise', true, 'upcoming_deadline', true));

alter table "public"."profiles" add constraint "notification_preferences_schema" CHECK (((jsonb_typeof(notification_preferences) = 'object'::text) AND (notification_preferences ? 'push_enabled'::text) AND (notification_preferences ? 'notifications'::text) AND (jsonb_typeof((notification_preferences -> 'notifications'::text)) = 'object'::text) AND ((notification_preferences -> 'notifications'::text) ? 'team_invitation'::text) AND ((notification_preferences -> 'notifications'::text) ? 'exercise_status_change'::text) AND ((notification_preferences -> 'notifications'::text) ? 'new_exercise'::text) AND ((notification_preferences -> 'notifications'::text) ? 'upcoming_deadline'::text))) not valid;

alter table "public"."profiles" validate constraint "notification_preferences_schema";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_notification_preferences(p_push_enabled boolean DEFAULT NULL::boolean, p_notification_settings jsonb DEFAULT NULL::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_current_preferences jsonb;
    v_new_notifications jsonb;
BEGIN
    -- Get current preferences
    SELECT notification_preferences INTO v_current_preferences
    FROM profiles
    WHERE id = auth.uid();

    -- Update push_enabled if provided
    IF p_push_enabled IS NOT NULL THEN
        v_current_preferences = jsonb_set(
            v_current_preferences,
            '{push_enabled}',
            to_jsonb(p_push_enabled)
        );
    END IF;

    -- Update notification settings if provided
    IF p_notification_settings IS NOT NULL THEN
        v_new_notifications = v_current_preferences->'notifications';
        
        -- Update only provided notification types
        IF p_notification_settings ? 'team_invitation' THEN
            v_new_notifications = jsonb_set(v_new_notifications, '{team_invitation}', p_notification_settings->'team_invitation');
        END IF;
        IF p_notification_settings ? 'exercise_status_change' THEN
            v_new_notifications = jsonb_set(v_new_notifications, '{exercise_status_change}', p_notification_settings->'exercise_status_change');
        END IF;
        IF p_notification_settings ? 'new_exercise' THEN
            v_new_notifications = jsonb_set(v_new_notifications, '{new_exercise}', p_notification_settings->'new_exercise');
        END IF;
        IF p_notification_settings ? 'upcoming_deadline' THEN
            v_new_notifications = jsonb_set(v_new_notifications, '{upcoming_deadline}', p_notification_settings->'upcoming_deadline');
        END IF;

        v_current_preferences = jsonb_set(
            v_current_preferences,
            '{notifications}',
            v_new_notifications
        );
    END IF;

    -- Update profile
    UPDATE profiles
    SET notification_preferences = v_current_preferences
    WHERE id = auth.uid();

    RETURN v_current_preferences;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.send_web_push_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    subscription_record record;
    user_preferences jsonb;
BEGIN
    -- Get user's notification preferences
    SELECT notification_preferences INTO user_preferences
    FROM profiles 
    WHERE id = NEW.user_id;

    -- Only proceed if push notifications are enabled and the notification type is enabled
    IF (user_preferences->>'push_enabled')::boolean = true 
    AND (user_preferences->'notifications'->>(NEW.type::text))::boolean = true THEN
        -- For each web push subscription for the user
        FOR subscription_record IN 
            SELECT subscription 
            FROM web_push_subscriptions 
            WHERE user_id = NEW.user_id
        LOOP
            PERFORM
                net.http_post(
                    url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/send-web-push'),
                    headers := jsonb_build_object(
                        'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                        'Content-Type', 'application/json'
                    ),
                    body := jsonb_build_object(
                        'subscription', subscription_record.subscription,
                        'notification', NEW.data,
                        'type', NEW.type
                    )
                );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$function$
;


