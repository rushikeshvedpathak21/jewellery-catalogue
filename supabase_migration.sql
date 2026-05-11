-- =============================================================
-- SATYAM JEWELLERS — SUPABASE MIGRATION
-- Run this in your Supabase SQL Editor to add missing columns
-- that the app needs. Safe to run on an existing database.
-- =============================================================

-- ───────────────────────────────────────────────
-- 1. CATEGORIES  — add multi-language + visibility
-- ───────────────────────────────────────────────
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS name_en    TEXT,
  ADD COLUMN IF NOT EXISTS name_hi    TEXT,
  ADD COLUMN IF NOT EXISTS name_mr    TEXT,
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- Back-fill from the original `name` column
UPDATE categories
SET
  name_en = COALESCE(name_en, name),
  name_hi = COALESCE(name_hi, name),
  name_mr = COALESCE(name_mr, name)
WHERE name_en IS NULL;

-- ───────────────────────────────────────────────
-- 2. PRODUCTS  — add all extended fields
-- ───────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS name_en                TEXT,
  ADD COLUMN IF NOT EXISTS name_hi                TEXT,
  ADD COLUMN IF NOT EXISTS name_mr                TEXT,
  ADD COLUMN IF NOT EXISTS description_en         TEXT,
  ADD COLUMN IF NOT EXISTS description_hi         TEXT,
  ADD COLUMN IF NOT EXISTS description_mr         TEXT,
  ADD COLUMN IF NOT EXISTS category_id            UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS metal_type             TEXT    DEFAULT 'Gold',
  ADD COLUMN IF NOT EXISTS weight_grams           NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_visible             BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS is_featured            BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_new_arrival         BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_out_of_stock        BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS view_count             INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS whatsapp_inquiry_count INTEGER DEFAULT 0;

-- Back-fill from the original simple columns
UPDATE products
SET
  name_en        = COALESCE(name_en, name),
  description_en = COALESCE(description_en, description),
  is_featured    = COALESCE(is_featured, featured)
WHERE name_en IS NULL;

-- ───────────────────────────────────────────────
-- 3. FEATURE FLAGS — add is_enabled + i18n columns
-- ───────────────────────────────────────────────
ALTER TABLE feature_flags
  ADD COLUMN IF NOT EXISTS is_enabled            BOOLEAN   DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS feature_name_en       TEXT,
  ADD COLUMN IF NOT EXISTS feature_name_hi       TEXT,
  ADD COLUMN IF NOT EXISTS feature_name_mr       TEXT,
  ADD COLUMN IF NOT EXISTS disabled_message_en   TEXT,
  ADD COLUMN IF NOT EXISTS disabled_message_hi   TEXT,
  ADD COLUMN IF NOT EXISTS disabled_message_mr   TEXT,
  ADD COLUMN IF NOT EXISTS updated_at            TIMESTAMP DEFAULT NOW();

-- Back-fill is_enabled from the original `enabled` column
UPDATE feature_flags
SET is_enabled = COALESCE(is_enabled, enabled)
WHERE is_enabled IS NULL;

-- Insert any missing default feature flags (safe – UNIQUE on feature_key)
INSERT INTO feature_flags (feature_key, enabled, is_enabled) VALUES
  ('catalogue',        true, true),
  ('search',           true, true),
  ('new_arrivals',     true, true),
  ('featured_products',true, true),
  ('product_detail',   true, true),
  ('category_filter',  true, true),
  ('metal_filter',     true, true),
  ('sort_options',     true, true),
  ('whatsapp_inquiry', true, true),
  ('photo_zoom',       true, true),
  ('share_product',    true, true),
  ('qr_code',          true, true),
  ('related_products', true, true),
  ('recently_viewed',  true, true),
  ('wishlist',         true, true),
  ('announcement_bar', true, true),
  ('instagram_link',   true, true),
  ('google_maps',      true, true),
  ('bulk_csv_upload',  false, false),
  ('theme_editor',     true, true),
  ('multi_language',   true, true)
ON CONFLICT (feature_key) DO NOTHING;

-- ───────────────────────────────────────────────
-- 4. ENABLE REALTIME on all tables
--    (Supabase UI: Database → Replication → enable
--     for products, categories, settings, feature_flags)
--    OR run the statements below:
-- ───────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE settings;
ALTER PUBLICATION supabase_realtime ADD TABLE feature_flags;

-- ───────────────────────────────────────────────
-- 5. STORAGE — ensure product-images bucket exists
--    Bucket name used by the app: "products"
--    Create it in Supabase Dashboard → Storage
--    and set it to Public so images load correctly.
-- ───────────────────────────────────────────────

-- ───────────────────────────────────────────────
-- 6. SETTINGS — add theme_json column
--    This stores the admin's saved theme so ALL
--    visitors see the correct colors, not just
--    the admin's own browser.
-- ───────────────────────────────────────────────
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS theme_json TEXT;

-- ───────────────────────────────────────────────
-- 6. SETTINGS — add theme_json column
--    Stores the full theme object so ALL visitors
--    see the admin's saved colors, not just them.
-- ───────────────────────────────────────────────
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS theme_json TEXT;
