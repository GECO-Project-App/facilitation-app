drop policy "Users can update own profile." on "public"."profiles";

drop policy "Users can update their own profile." on "public"."profiles";

create policy "Users can update own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



