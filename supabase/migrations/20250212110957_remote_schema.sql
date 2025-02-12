set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    update notifications
    set is_read = true
    where id = p_notification_id
    and user_id = auth.uid();
    
    return found;
end;
$function$
;

create policy "Users can mark their own notifications as read"
on "public"."notifications"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check (((auth.uid() = user_id) AND (is_read = true)));



