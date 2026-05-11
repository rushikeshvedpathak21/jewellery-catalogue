create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_hi text not null,
  name_mr text not null,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_hi text not null,
  name_mr text not null,
  description_en text not null default '',
  description_hi text not null default '',
  description_mr text not null default '',
  category_id uuid references categories(id) on delete set null,
  metal_type text not null default 'Gold',
  weight_grams numeric(10,2) not null default 0,
  images text[] not null default '{}',
  is_visible boolean not null default true,
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  is_out_of_stock boolean not null default false,
  view_count integer not null default 0,
  whatsapp_inquiry_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null default 'Jewellery Shop',
  whatsapp_number text not null default '',
  address text not null default '',
  google_maps_link text not null default '',
  open_hours text not null default '',
  banner_image_url text not null default '',
  instagram_link text not null default '',
  announcement_text_en text not null default '',
  announcement_text_hi text not null default '',
  announcement_text_mr text not null default '',
  announcement_visible boolean not null default true
);

create table if not exists feature_flags (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null unique,
  feature_name_en text not null,
  feature_name_hi text not null,
  feature_name_mr text not null,
  is_enabled boolean not null default true,
  disabled_message_en text not null default '',
  disabled_message_hi text not null default '',
  disabled_message_mr text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_is_visible on products(is_visible);
create index if not exists idx_products_is_featured on products(is_featured);
create index if not exists idx_products_is_new_arrival on products(is_new_arrival);

alter table categories enable row level security;
alter table products enable row level security;
alter table settings enable row level security;
alter table feature_flags enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read settings" on settings for select using (true);
create policy "public read feature_flags" on feature_flags for select using (true);

create policy "admin all categories" on categories for all using (true) with check (true);
create policy "admin all products" on products for all using (true) with check (true);
create policy "admin all settings" on settings for all using (true) with check (true);
create policy "admin all feature_flags" on feature_flags for all using (true) with check (true);
