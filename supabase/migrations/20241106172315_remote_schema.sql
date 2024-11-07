drop policy "team_members_delete_policy" on "public"."team_members";

drop policy "teams_delete_policy" on "public"."teams";

drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "team_members_select_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.refresh_team_memberships()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.team_memberships;
  RETURN NULL;
END;
$function$
;

create materialized view "public"."team_memberships" as  SELECT DISTINCT team_members.user_id,
    team_members.team_id
   FROM team_members;


CREATE UNIQUE INDEX team_memberships_unique_idx ON public.team_memberships USING btree (user_id, team_id);

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
using (((user_id = auth.uid()) OR (team_id IN ( SELECT team_memberships.team_id
   FROM team_memberships
  WHERE (team_memberships.user_id = auth.uid())))));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using (((created_by = auth.uid()) OR (id IN ( SELECT DISTINCT team_members.team_id
   FROM team_members
  WHERE (team_members.user_id = auth.uid()))) OR (team_code = current_setting('app.current_team_code'::text, true))));


CREATE TRIGGER refresh_team_memberships_trigger AFTER INSERT OR DELETE OR UPDATE ON public.team_members FOR EACH STATEMENT EXECUTE FUNCTION refresh_team_memberships();


