-- ============================================================
-- Shree Bakers – Storage Buckets
-- Migration: 002_storage_buckets.sql
-- Creates public storage buckets for product images,
-- gallery images, and owner photo.
-- ============================================================

-- ─── 1. Buckets ──────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('gallery-images', 'gallery-images', true, 5242880,  array['image/jpeg','image/png','image/webp','image/gif']),
  ('owner-photo',    'owner-photo',    true, 2097152,  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- ─── 2. RLS Policies for storage objects ─────────────────────────────────────

-- product-images: public read, authenticated upload/delete
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- gallery-images: public read, authenticated upload/delete
create policy "Public read gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

create policy "Admin upload gallery images"
  on storage.objects for insert
  with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');

create policy "Admin delete gallery images"
  on storage.objects for delete
  using (bucket_id = 'gallery-images' and auth.role() = 'authenticated');

-- owner-photo: public read, authenticated upload/delete
create policy "Public read owner photo"
  on storage.objects for select
  using (bucket_id = 'owner-photo');

create policy "Admin upload owner photo"
  on storage.objects for insert
  with check (bucket_id = 'owner-photo' and auth.role() = 'authenticated');

create policy "Admin delete owner photo"
  on storage.objects for delete
  using (bucket_id = 'owner-photo' and auth.role() = 'authenticated');

-- Done ✓
