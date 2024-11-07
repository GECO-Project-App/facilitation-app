drop trigger if exists "on_profile_update" on "public"."profiles";

drop trigger if exists "refresh_team_memberships_trigger" on "public"."team_members";

drop trigger if exists "on_team_created" on "public"."teams";

drop policy "Users can update own profile." on "public"."profiles";

drop policy "Insert team members through trigger" on "public"."team_members";

drop policy "Only facilitators can update roles" on "public"."team_members";

drop policy "team_members_delete_policy" on "public"."team_members";

drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

drop policy "team_members_update_policy" on "public"."team_members";

drop policy "teams_delete_policy" on "public"."teams";

drop policy "teams_insert_policy" on "public"."teams";

drop policy "teams_select_policy" on "public"."teams";

drop policy "Users can insert their own profile." on "public"."profiles";

revoke delete on table "public"."debug_logs" from "anon";

revoke insert on table "public"."debug_logs" from "anon";

revoke references on table "public"."debug_logs" from "anon";

revoke select on table "public"."debug_logs" from "anon";

revoke trigger on table "public"."debug_logs" from "anon";

revoke truncate on table "public"."debug_logs" from "anon";

revoke update on table "public"."debug_logs" from "anon";

revoke delete on table "public"."debug_logs" from "authenticated";

revoke insert on table "public"."debug_logs" from "authenticated";

revoke references on table "public"."debug_logs" from "authenticated";

revoke select on table "public"."debug_logs" from "authenticated";

revoke trigger on table "public"."debug_logs" from "authenticated";

revoke truncate on table "public"."debug_logs" from "authenticated";

revoke update on table "public"."debug_logs" from "authenticated";

revoke delete on table "public"."debug_logs" from "service_role";

revoke insert on table "public"."debug_logs" from "service_role";

revoke references on table "public"."debug_logs" from "service_role";

revoke select on table "public"."debug_logs" from "service_role";

revoke trigger on table "public"."debug_logs" from "service_role";

revoke truncate on table "public"."debug_logs" from "service_role";

revoke update on table "public"."debug_logs" from "service_role";

revoke delete on table "public"."team_members" from "anon";

revoke insert on table "public"."team_members" from "anon";

revoke references on table "public"."team_members" from "anon";

revoke select on table "public"."team_members" from "anon";

revoke trigger on table "public"."team_members" from "anon";

revoke truncate on table "public"."team_members" from "anon";

revoke update on table "public"."team_members" from "anon";

revoke delete on table "public"."team_members" from "authenticated";

revoke insert on table "public"."team_members" from "authenticated";

revoke references on table "public"."team_members" from "authenticated";

revoke select on table "public"."team_members" from "authenticated";

revoke trigger on table "public"."team_members" from "authenticated";

revoke truncate on table "public"."team_members" from "authenticated";

revoke update on table "public"."team_members" from "authenticated";

revoke delete on table "public"."team_members" from "service_role";

revoke insert on table "public"."team_members" from "service_role";

revoke references on table "public"."team_members" from "service_role";

revoke select on table "public"."team_members" from "service_role";

revoke trigger on table "public"."team_members" from "service_role";

revoke truncate on table "public"."team_members" from "service_role";

revoke update on table "public"."team_members" from "service_role";

revoke delete on table "public"."teams" from "anon";

revoke insert on table "public"."teams" from "anon";

revoke references on table "public"."teams" from "anon";

revoke select on table "public"."teams" from "anon";

revoke trigger on table "public"."teams" from "anon";

revoke truncate on table "public"."teams" from "anon";

revoke update on table "public"."teams" from "anon";

revoke delete on table "public"."teams" from "authenticated";

revoke insert on table "public"."teams" from "authenticated";

revoke references on table "public"."teams" from "authenticated";

revoke select on table "public"."teams" from "authenticated";

revoke trigger on table "public"."teams" from "authenticated";

revoke truncate on table "public"."teams" from "authenticated";

revoke update on table "public"."teams" from "authenticated";

revoke delete on table "public"."teams" from "service_role";

revoke insert on table "public"."teams" from "service_role";

revoke references on table "public"."teams" from "service_role";

revoke select on table "public"."teams" from "service_role";

revoke trigger on table "public"."teams" from "service_role";

revoke truncate on table "public"."teams" from "service_role";

revoke update on table "public"."teams" from "service_role";

alter table "public"."team_members" drop constraint "team_members_team_id_fkey";

alter table "public"."team_members" drop constraint "team_members_user_id_fkey";

alter table "public"."teams" drop constraint "teams_created_by_fkey";

alter table "public"."teams" drop constraint "teams_team_code_key";

drop index if exists "public"."team_memberships_unique_idx";

drop function if exists "public"."check_team_management_permission"(team_id uuid, user_id uuid);

drop function if exists "public"."get_team_by_code"(code text);

drop function if exists "public"."handle_new_team"();

drop function if exists "public"."refresh_team_memberships"();

drop function if exists "public"."set_team_code"(code text);

drop function if exists "public"."sync_team_member_profile"();

drop materialized view if exists "public"."team_memberships";

alter table "public"."debug_logs" drop constraint "debug_logs_pkey";

alter table "public"."team_members" drop constraint "team_members_pkey";

alter table "public"."teams" drop constraint "teams_pkey";

drop index if exists "public"."debug_logs_pkey";

drop index if exists "public"."idx_team_members_user_team";

drop index if exists "public"."team_members_pkey";

drop index if exists "public"."teams_pkey";

drop index if exists "public"."teams_team_code_key";

drop table "public"."debug_logs";

drop table "public"."team_members";

drop table "public"."teams";

alter table "public"."profiles" alter column "updated_at" set default now();

drop sequence if exists "public"."debug_logs_id_seq";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    avatar_url,
    username,
    updated_at
  ) values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username',
    now()
  );
  return new;
end;
$function$
;

create policy "Users can update their own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));



