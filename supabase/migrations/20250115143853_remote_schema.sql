drop function if exists "public"."check_exercise_completion"();

drop function if exists "public"."check_team_exercise_completion"();

create policy "Users can insert their own exercise data"
on "public"."exercise_data"
as permissive
for insert
to authenticated
with check ((auth.uid() = author_id));


create policy "Users can read their own exercise data"
on "public"."exercise_data"
as permissive
for select
to authenticated
using ((auth.uid() = author_id));


create policy "Users can update their own exercise data"
on "public"."exercise_data"
as permissive
for update
to authenticated
using ((auth.uid() = author_id))
with check ((auth.uid() = author_id));



