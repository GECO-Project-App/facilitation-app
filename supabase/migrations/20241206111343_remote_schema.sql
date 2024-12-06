set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.current_user_email()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce(
    (select email from auth.users where id = auth.uid()),
    (select email from team_invitations where id = current_setting('app.invitation_id', true)::uuid)
  );
$function$
;

CREATE OR REPLACE FUNCTION public.join_team_by_invitation(invitation_id uuid, user_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_team_id uuid;
begin
  -- Set invitation context
  perform set_config('app.invitation_id', invitation_id::text, true);
  
  -- Get team_id from invitation
  select team_id into v_team_id
  from team_invitations
  where id = invitation_id
  and status = 'awaiting_signup';

  if v_team_id is null then
    raise exception 'Invalid invitation';
  end if;

  -- Rest of your existing function logic...

  return v_team_id;
end;
$function$
;

create policy "Users can read their own invitations during signup"
on "public"."team_invitations"
as permissive
for select
to public
using (((email = current_user_email()) AND (status = 'awaiting_signup'::team_invitation_status)));


create policy "Users can update their own invitation status"
on "public"."team_invitations"
as permissive
for update
to public
using ((email = current_user_email()))
with check ((status = 'accepted'::team_invitation_status));



