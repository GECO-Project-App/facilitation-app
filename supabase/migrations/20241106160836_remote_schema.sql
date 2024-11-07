create sequence "public"."debug_logs_id_seq";

drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

create table "public"."debug_logs" (
    "id" integer not null default nextval('debug_logs_id_seq'::regclass),
    "timestamp" timestamp with time zone default now(),
    "action" text,
    "details" jsonb
);


alter sequence "public"."debug_logs_id_seq" owned by "public"."debug_logs"."id";

CREATE UNIQUE INDEX debug_logs_pkey ON public.debug_logs USING btree (id);

alter table "public"."debug_logs" add constraint "debug_logs_pkey" PRIMARY KEY using index "debug_logs_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_team()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Set team_code if not provided
    IF NEW.team_code IS NULL THEN
        UPDATE teams 
        SET team_code = upper(substring(md5(random()::text) from 1 for 6))
        WHERE id = NEW.id;
    END IF;

    -- Insert the creator as a facilitator with their profile info
    -- Modified to use LEFT JOIN so it works even without profile data
    INSERT INTO team_members (
        team_id, 
        user_id, 
        role,
        first_name,
        last_name,
        avatar_url
    )
    SELECT 
        NEW.id,
        NEW.created_by,
        'facilitator'::team_role,
        COALESCE(profiles.first_name, ''),  -- Use empty string if no profile
        COALESCE(profiles.last_name, ''),   -- Use empty string if no profile
        profiles.avatar_url                  -- NULL is ok for avatar
    FROM (SELECT NEW.id, NEW.created_by) AS team_data
    LEFT JOIN profiles ON profiles.id = NEW.created_by;

    RETURN NEW;
END;
$function$
;

grant delete on table "public"."debug_logs" to "anon";

grant insert on table "public"."debug_logs" to "anon";

grant references on table "public"."debug_logs" to "anon";

grant select on table "public"."debug_logs" to "anon";

grant trigger on table "public"."debug_logs" to "anon";

grant truncate on table "public"."debug_logs" to "anon";

grant update on table "public"."debug_logs" to "anon";

grant delete on table "public"."debug_logs" to "authenticated";

grant insert on table "public"."debug_logs" to "authenticated";

grant references on table "public"."debug_logs" to "authenticated";

grant select on table "public"."debug_logs" to "authenticated";

grant trigger on table "public"."debug_logs" to "authenticated";

grant truncate on table "public"."debug_logs" to "authenticated";

grant update on table "public"."debug_logs" to "authenticated";

grant delete on table "public"."debug_logs" to "service_role";

grant insert on table "public"."debug_logs" to "service_role";

grant references on table "public"."debug_logs" to "service_role";

grant select on table "public"."debug_logs" to "service_role";

grant trigger on table "public"."debug_logs" to "service_role";

grant truncate on table "public"."debug_logs" to "service_role";

grant update on table "public"."debug_logs" to "service_role";

create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check (true);


create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using (true);



