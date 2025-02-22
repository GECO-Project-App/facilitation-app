-- Add IF NOT EXISTS to prevent duplicate bucket error
insert into storage.buckets (id, name)
  select 'avatars', 'avatars'
  where not exists (
    select 1 from storage.buckets where id = 'avatars'
  );

create policy "Anyone can upload an avatar."
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'avatars'::text));


create policy "Avatar images are publicly accessible."
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'avatars'::text));
