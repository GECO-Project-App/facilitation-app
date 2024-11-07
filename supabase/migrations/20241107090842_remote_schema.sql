drop trigger if exists "refresh_team_memberships_trigger" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

drop index if exists "public"."team_memberships_unique_idx";

drop function if exists "public"."refresh_team_memberships"();

drop materialized view if exists "public"."team_memberships";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_team_code(code text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  PERFORM set_config('app.current_team_code', code, TRUE);
END;
$function$
;

create policy "team_members_insert_policy"
on "public"."team_members"
as permissive
for insert
to public
with check (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM teams
  WHERE ((teams.id = team_members.team_id) AND (teams.created_by = auth.uid()))))));


create policy "team_members_select_policy"
on "public"."team_members"
as permissive
for select
to public
using (((user_id = auth.uid()) OR (team_id IN ( SELECT teams.id
   FROM teams
  WHERE (teams.created_by = auth.uid())))));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using (((created_by = auth.uid()) OR (id IN ( SELECT team_members.team_id
   FROM team_members
  WHERE (team_members.user_id = auth.uid()))) OR (team_code = current_setting('app.current_team_code'::text, true))));



