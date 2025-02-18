create table "public"."web_push_subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "subscription" jsonb not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."web_push_subscriptions" enable row level security;

CREATE UNIQUE INDEX web_push_subscriptions_pkey ON public.web_push_subscriptions USING btree (id);

alter table "public"."web_push_subscriptions" add constraint "web_push_subscriptions_pkey" PRIMARY KEY using index "web_push_subscriptions_pkey";

alter table "public"."web_push_subscriptions" add constraint "web_push_subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."web_push_subscriptions" validate constraint "web_push_subscriptions_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.send_web_push_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    subscription_record record;
begin
    -- For each web push subscription for the user
    for subscription_record in 
        select subscription 
        from web_push_subscriptions 
        where user_id = NEW.user_id
    loop
        -- Call edge function to send push notification
        perform
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
    end loop;
    
    return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_exercise_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Create notifications in the database
    PERFORM create_exercise_status_notification(NEW.id);
    
    -- Call the edge function using extensions.http_post instead of net.http_post
    PERFORM
        extensions.http_post(
            url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/notify-exercise-status'),
            headers := jsonb_build_object(
                'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                'Content-Type', 'application/json'
            ),
            body := jsonb_build_object('exerciseId', NEW.id)
        );
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in handle_exercise_status_change: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_exercise_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Only notify when status changes to 'reviewing'
    IF NEW.status = 'reviewing' AND OLD.status = 'writing' THEN
        PERFORM
            extensions.http_post(
                url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/notify-exercise-status'),
                headers := jsonb_build_object(
                    'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key')),
                    'Content-Type', 'application/json'
                ),
                body := jsonb_build_object('exerciseId', NEW.id)
            );
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in notify_exercise_status_change: %', SQLERRM;
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."web_push_subscriptions" to "anon";

grant insert on table "public"."web_push_subscriptions" to "anon";

grant references on table "public"."web_push_subscriptions" to "anon";

grant select on table "public"."web_push_subscriptions" to "anon";

grant trigger on table "public"."web_push_subscriptions" to "anon";

grant truncate on table "public"."web_push_subscriptions" to "anon";

grant update on table "public"."web_push_subscriptions" to "anon";

grant delete on table "public"."web_push_subscriptions" to "authenticated";

grant insert on table "public"."web_push_subscriptions" to "authenticated";

grant references on table "public"."web_push_subscriptions" to "authenticated";

grant select on table "public"."web_push_subscriptions" to "authenticated";

grant trigger on table "public"."web_push_subscriptions" to "authenticated";

grant truncate on table "public"."web_push_subscriptions" to "authenticated";

grant update on table "public"."web_push_subscriptions" to "authenticated";

grant delete on table "public"."web_push_subscriptions" to "service_role";

grant insert on table "public"."web_push_subscriptions" to "service_role";

grant references on table "public"."web_push_subscriptions" to "service_role";

grant select on table "public"."web_push_subscriptions" to "service_role";

grant trigger on table "public"."web_push_subscriptions" to "service_role";

grant truncate on table "public"."web_push_subscriptions" to "service_role";

grant update on table "public"."web_push_subscriptions" to "service_role";

create policy "Users can manage their own subscriptions"
on "public"."web_push_subscriptions"
as permissive
for all
to authenticated
using ((auth.uid() = user_id));


CREATE TRIGGER send_web_push_notification_trigger AFTER INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION send_web_push_notification();


