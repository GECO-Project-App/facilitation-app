set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.send_web_push_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    subscription_record record;
    user_locale text;
begin
    -- Get user's locale preference
    select coalesce(locale, 'en') into user_locale 
    from profiles 
    where id = NEW.user_id;

    -- For each web push subscription for the user
    for subscription_record in 
        select subscription 
        from web_push_subscriptions 
        where user_id = NEW.user_id
    loop
        -- Include locale in the notification data
        perform
            net.http_post(
                url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/send-web-push'),
                headers := jsonb_build_object(
                    'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                    'Content-Type', 'application/json'
                ),
                body := jsonb_build_object(
                    'subscription', subscription_record.subscription,
                    'notification', jsonb_build_object(
                        'locale', user_locale
                    ) || NEW.data,
                    'type', NEW.type
                )
            );
    end loop;
    
    return NEW;
end;
$function$
;


