-- ====================================================================
-- Shree Bakers – Fix Owner Details & Storage Permissions
-- Migration: 005_fix_owner_and_storage.sql
-- Run this query in Supabase Dashboard → SQL Editor → New query
-- ====================================================================

-- 1. Ensure owner_details table exists
create table if not exists public.owner_details (
  singleton_id boolean     primary key default true,
  constraint   only_one_owner check (singleton_id = true),
  name         text        default '',
  title        text        default 'Founder & Head Baker',
  bio          text        default '',
  photo        text        default '',
  phone        text        default '',
  email        text        default '',
  updated_at   timestamptz not null default now()
);

-- 2. Remove default 'Adarsh Rai' from name column and clear any prefilled name
alter table public.owner_details alter column name drop default;
alter table public.owner_details alter column name drop not null;
update public.owner_details set name = '' where name = 'Adarsh Rai';

-- 3. Ensure a base row exists
insert into public.owner_details (singleton_id, name, title, bio, photo, phone, email)
values (
  true,
  '',
  'Founder & Head Baker',
  'With a deep passion for baking and an eye for detail, Shree Bakers was founded with a simple mission — bring fresh, handcrafted bakes to every table in Varanasi.',
  '',
  '',
  ''
)
on conflict (singleton_id) do update set
  name = case when public.owner_details.name = 'Adarsh Rai' then '' else public.owner_details.name end;

-- 4. Fix RLS on owner_details (allow public read, full edit access for admin/staff)
alter table public.owner_details enable row level security;

drop policy if exists "Public read owner details" on public.owner_details;
create policy "Public read owner details"
  on public.owner_details for select
  using (true);

drop policy if exists "Admin update owner details" on public.owner_details;
create policy "Admin update owner details"
  on public.owner_details for all
  using (true)
  with check (true);

-- 5. Fix RLS on gallery_photos table
alter table public.gallery_photos enable row level security;

drop policy if exists "Public read gallery" on public.gallery_photos;
create policy "Public read gallery"
  on public.gallery_photos for select
  using (true);

drop policy if exists "Admin full access to gallery" on public.gallery_photos;
create policy "Admin full access to gallery"
  on public.gallery_photos for all
  using (true);

-- 6. Ensure Storage Buckets exist and are public
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('owner-photo',    'owner-photo',    true, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('gallery-images', 'gallery-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true;

-- 7. Fix Storage RLS policies for owner-photo
drop policy if exists "Public read owner photo" on storage.objects;
create policy "Public read owner photo"
  on storage.objects for select
  using (bucket_id = 'owner-photo');

drop policy if exists "Admin upload owner photo" on storage.objects;
create policy "Admin upload owner photo"
  on storage.objects for insert
  with check (bucket_id = 'owner-photo');

drop policy if exists "Admin update owner photo" on storage.objects;
create policy "Admin update owner photo"
  on storage.objects for update
  using (bucket_id = 'owner-photo');

drop policy if exists "Admin delete owner photo" on storage.objects;
create policy "Admin delete owner photo"
  on storage.objects for delete
  using (bucket_id = 'owner-photo');

-- 8. Fix Storage RLS policies for gallery-images
drop policy if exists "Public read gallery images" on storage.objects;
create policy "Public read gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

drop policy if exists "Admin upload gallery images" on storage.objects;
create policy "Admin upload gallery images"
  on storage.objects for insert
  with check (bucket_id = 'gallery-images');

drop policy if exists "Admin update gallery images" on storage.objects;
create policy "Admin update gallery images"
  on storage.objects for update
  using (bucket_id = 'gallery-images');

drop policy if exists "Admin delete gallery images" on storage.objects;
create policy "Admin delete gallery images"
  on storage.objects for delete
  using (bucket_id = 'gallery-images');
