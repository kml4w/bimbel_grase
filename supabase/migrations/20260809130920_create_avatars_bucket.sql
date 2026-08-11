-- Create avatars storage bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- RLS is already enabled by default on Supabase for storage.objects

-- Policy: Everyone can view avatars
create policy "Avatars are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy: Authenticated users can upload avatars
create policy "Authenticated users can upload avatars."
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' 
    and auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can update their own uploads
create policy "Authenticated users can update avatars."
  on storage.objects for update
  using (
    bucket_id = 'avatars' 
    and auth.role() = 'authenticated'
  );

-- Policy: Authenticated users can delete their own uploads
create policy "Authenticated users can delete avatars."
  on storage.objects for delete
  using (
    bucket_id = 'avatars' 
    and auth.role() = 'authenticated'
  );
