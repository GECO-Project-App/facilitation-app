create type "public"."notification_type" as enum ('team_invitation', 'exercise_status_change', 'new_exercise', 'upcoming_deadline');

create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "type" notification_type not null,
    "data" jsonb not null,
    "is_read" boolean not null default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."notifications" enable row level security;

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."notifications" add constraint "notifications_data_check" CHECK ((jsonb_typeof(data) = 'object'::text)) not valid;

alter table "public"."notifications" validate constraint "notifications_data_check";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.check_upcoming_deadlines()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    exercise record;
begin
    -- Check for deadlines 24 hours away
    for exercise in (
        select id
        from exercises
        where 
            (deadline->>'writing')::timestamptz between now() and now() + interval '24 hours'
            or (deadline->>'reviewing')::timestamptz between now() and now() + interval '24 hours'
    )
    loop
        -- Create notifications for writing deadline
        if (exercise.deadline->>'writing')::timestamptz between now() and now() + interval '24 hours' then
            perform create_deadline_notification(exercise.id, 'writing');
        end if;
        
        -- Create notifications for reviewing deadline
        if (exercise.deadline->>'reviewing')::timestamptz between now() and now() + interval '24 hours' then
            perform create_deadline_notification(exercise.id, 'reviewing');
        end if;
    end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_deadline_notification(p_exercise_id uuid, p_deadline_type text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    v_team_members record;
    v_exercise record;
begin
    -- Get exercise details
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
                'deadline_time', v_exercise.deadline->>p_deadline_type
            )
        );
    end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_exercise_status_notification(p_exercise_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    v_team_members record;
    v_exercise record;
begin
    -- Get exercise details
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
            'exercise_status_change',
            jsonb_build_object(
                'exercise_id', p_exercise_id,
                'team_name', v_exercise.team_name,
                'new_status', v_exercise.status
            )
        );
    end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_new_exercise_notification(p_exercise_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
    v_team_members record;
    v_exercise record;
begin
    -- Get exercise details
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
                'team_name', v_exercise.team_name
            )
        );
    end loop;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.create_team_invitation_notification(p_user_id uuid, p_team_id uuid, p_team_name text, p_inviter_name text)
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
            'inviter_name', p_inviter_name
        )
    );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_exercise_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    perform create_exercise_status_notification(NEW.id);
    return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_exercise()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    perform create_new_exercise_notification(NEW.id);
    return NEW;
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

    -- Create notification
    perform create_team_invitation_notification(
        (select id from auth.users where email = NEW.email),
        NEW.team_id,
        v_team_name,
        v_inviter_name
    );
    
    return NEW;
end;
$function$
;

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

create policy "System can create notifications"
on "public"."notifications"
as permissive
for insert
to authenticated
with check (true);


create policy "Users can view their own notifications"
on "public"."notifications"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


CREATE TRIGGER on_exercise_created AFTER INSERT ON public.exercises FOR EACH ROW EXECUTE FUNCTION handle_new_exercise();

CREATE TRIGGER on_exercise_status_change AFTER UPDATE OF status ON public.exercises FOR EACH ROW WHEN ((old.status IS DISTINCT FROM new.status)) EXECUTE FUNCTION handle_exercise_status_change();

CREATE TRIGGER on_team_invitation AFTER INSERT ON public.team_invitations FOR EACH ROW EXECUTE FUNCTION handle_team_invitation();


