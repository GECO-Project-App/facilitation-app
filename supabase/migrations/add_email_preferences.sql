-- Add email_preferences column to profiles table
alter table "public"."profiles" add column "email_preferences" jsonb not null default jsonb_build_object('email_enabled', true, 'notifications', jsonb_build_object('team_invitation', true, 'exercise_status_change', true, 'new_exercise', true, 'upcoming_deadline', true));

-- Add constraint to ensure email_preferences has the correct structure
alter table "public"."profiles" add constraint "email_preferences_schema" CHECK (((jsonb_typeof(email_preferences) = 'object'::text) AND (email_preferences ? 'email_enabled'::text) AND (email_preferences ? 'notifications'::text) AND (jsonb_typeof((email_preferences -> 'notifications'::text)) = 'object'::text) AND ((email_preferences -> 'notifications'::text) ? 'team_invitation'::text) AND ((email_preferences -> 'notifications'::text) ? 'exercise_status_change'::text) AND ((email_preferences -> 'notifications'::text) ? 'new_exercise'::text) AND ((email_preferences -> 'notifications'::text) ? 'upcoming_deadline'::text))) not valid;

-- Validate the constraint
alter table "public"."profiles" validate constraint "email_preferences_schema";

-- Create function to update email preferences
CREATE OR REPLACE FUNCTION public.update_email_preferences(p_email_enabled boolean DEFAULT NULL::boolean, p_notification_settings jsonb DEFAULT NULL::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_current_preferences jsonb;
    v_new_notifications jsonb;
BEGIN
    -- Get current preferences
    SELECT email_preferences INTO v_current_preferences
    FROM profiles
    WHERE id = auth.uid();

    -- Update email_enabled if provided
    IF p_email_enabled IS NOT NULL THEN
        v_current_preferences = jsonb_set(
            v_current_preferences,
            '{email_enabled}',
            to_jsonb(p_email_enabled)
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
    SET email_preferences = v_current_preferences
    WHERE id = auth.uid();

    RETURN v_current_preferences;
END;
$function$;

