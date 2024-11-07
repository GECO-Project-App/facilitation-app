drop policy "team_members_insert_policy" on "public"."team_members";

drop policy "teams_select_policy" on "public"."teams";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_team_by_code(code text)
 RETURNS TABLE(id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT teams.id 
  FROM teams 
  WHERE team_code = code;
END;
$function$
;

create policy "teams_select_by_code_policy"
on "public"."teams"
as permissive
for select
to public
using ((team_code IS NOT NULL));


create policy "teams_select_policy"
on "public"."teams"
as permissive
for select
to public
using (((created_by = auth.uid()) OR (id IN ( SELECT DISTINCT team_members.team_id
   FROM team_members
  WHERE (team_members.user_id = auth.uid())))));



