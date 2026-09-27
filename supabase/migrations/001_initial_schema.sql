-- ============================================================
-- Shree Bakers – Supabase Initial Schema Migration
-- Migration: 001_initial_schema.sql
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ─── 1. PRODUCTS ─────────────────────────────────────────────────────────────
-- Mirrors MenuItem type from src/data/menu.ts
create table if not exists public.products (
  id          text        primary key,
  name        text        not null,
  description text        not null default '',
  price       integer     not null check (price >= 0),          -- stored in paise? No — stored as rupees integer
  category    text        not null,
  image       text        not null default '',                  -- URL (Supabase Storage) or bundled asset path
  popular     integer     not null default 50 check (popular between 0 and 100),
  badge       text        check (badge in ('Best Seller', 'New', '20% OFF')),
  available   boolean     not null default true,
  featured    boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- RLS: Admin can do anything; public can read available products
alter table public.products enable row level security;

create policy "Public read available products"
  on public.products for select
  using (available = true);

create policy "Admin full access to products"
  on public.products for all
  using (auth.role() = 'authenticated');


-- ─── 2. FAQS ─────────────────────────────────────────────────────────────────
-- Mirrors FAQ interface from src/services/faqService.ts
create table if not exists public.faqs (
  id          text        primary key default 'faq-' || gen_random_uuid()::text,
  question    text        not null,
  answer      text        not null,
  category    text        not null
                          check (category in ('General','Products','Cakes','Delivery','Orders','Payments')),
  visible     boolean     not null default true,
  "order"     integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger faqs_updated_at
  before update on public.faqs
  for each row execute procedure public.set_updated_at();

alter table public.faqs enable row level security;

create policy "Public read visible FAQs"
  on public.faqs for select
  using (visible = true);

create policy "Admin full access to faqs"
  on public.faqs for all
  using (auth.role() = 'authenticated');


-- ─── 3. APP_SETTINGS ─────────────────────────────────────────────────────────
-- Mirrors AppSettings from src/services/settingsService.ts
-- Single-row table pattern (enforced by singleton_id check constraint)
create table if not exists public.app_settings (
  singleton_id boolean     primary key default true,
  constraint   only_one_row check (singleton_id = true),
  categories   text[]      not null default array[
    'Cakes','Pastries','Breads','Cookies',
    'Pizzas','Burgers','Sandwiches','Beverages','Gift Hampers'
  ],
  badges       text[]      not null default array['none','Best Seller','New','20% OFF'],
  updated_at   timestamptz not null default now()
);

create trigger app_settings_updated_at
  before update on public.app_settings
  for each row execute procedure public.set_updated_at();

-- Seed with defaults
insert into public.app_settings (singleton_id) values (true)
  on conflict do nothing;

alter table public.app_settings enable row level security;

create policy "Public read app settings"
  on public.app_settings for select using (true);

create policy "Admin update app settings"
  on public.app_settings for all
  using (auth.role() = 'authenticated');


-- ─── 4. GALLERY_PHOTOS ───────────────────────────────────────────────────────
-- Mirrors GalleryPhoto from src/services/galleryService.ts
create table if not exists public.gallery_photos (
  id          text        primary key default 'photo-' || gen_random_uuid()::text,
  src         text        not null,   -- Supabase Storage public URL
  alt         text        not null default '',
  tag         text        not null
                          check (tag in ('Cakes','Pastries','Pizza','Bakery','Store Interior')),
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

create policy "Public read gallery photos"
  on public.gallery_photos for select using (true);

create policy "Admin full access to gallery"
  on public.gallery_photos for all
  using (auth.role() = 'authenticated');


-- ─── 5. OWNER_DETAILS ────────────────────────────────────────────────────────
-- Mirrors OwnerDetails from src/services/galleryService.ts
-- Single-row table (same singleton pattern)
create table if not exists public.owner_details (
  singleton_id boolean     primary key default true,
  constraint   only_one_owner check (singleton_id = true),
  name         text        not null default 'Adarsh Rai',
  title        text        not null default 'Founder & Head Baker',
  bio          text        not null default '',
  photo        text        not null default '',   -- Supabase Storage public URL
  phone        text        not null default '',
  email        text        not null default '',
  updated_at   timestamptz not null default now()
);

create trigger owner_details_updated_at
  before update on public.owner_details
  for each row execute procedure public.set_updated_at();

-- Seed default owner row
insert into public.owner_details (singleton_id, name, title)
  values (true, 'Adarsh Rai', 'Founder & Head Baker')
  on conflict do nothing;

alter table public.owner_details enable row level security;

create policy "Public read owner details"
  on public.owner_details for select using (true);

create policy "Admin update owner details"
  on public.owner_details for all
  using (auth.role() = 'authenticated');


-- ─── 6. ORDERS (future) ──────────────────────────────────────────────────────
-- Currently orders are sent to WhatsApp. This table is pre-defined for
-- future order tracking / admin order history features.
create table if not exists public.orders (
  id              uuid        primary key default gen_random_uuid(),
  customer_name   text        not null,
  customer_phone  text        not null,
  address         text        not null,
  pin_code        text        not null default '',
  landmark        text        not null default '',
  notes           text        not null default '',
  payment_method  text        not null
                              check (payment_method in ('cod','upi','card')),
  subtotal        integer     not null,   -- in rupees
  discount        integer     not null default 0,
  gst             integer     not null default 0,
  delivery_fee    integer     not null default 0,
  total           integer     not null,
  status          text        not null default 'pending'
                              check (status in ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  items           jsonb       not null default '[]'::jsonb,
                              -- [{id, name, price, qty, image}]
  coupon_code     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

alter table public.orders enable row level security;

create policy "Public insert orders"
  on public.orders for insert
  with check (true);

create policy "Admin read all orders"
  on public.orders for select
  using (auth.role() = 'authenticated');

create policy "Admin update orders"
  on public.orders for update
  using (auth.role() = 'authenticated');


-- ─── STORAGE BUCKETS (run separately in Storage UI or paste here) ─────────────
-- Bucket: product-images   (public)
-- Bucket: gallery-images   (public)
-- Bucket: owner-photo      (public)
--
-- These can also be created via the Supabase Dashboard → Storage → New Bucket
-- or via the storage API after you have the credentials.

-- Done ✓
