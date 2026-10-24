-- ============================================================
-- MEDIEA SOLUTION — Complete Database Setup (Consolidated)
--
-- File tunggal yang menggabungkan seluruh schema database.
-- Bisa dijalankan ulang tanpa error (idempotent).
--
-- Isi:
--   1. Enum Types
--   2. Core Tables (users, access_codes, platforms, assets, articles, modules)
--   3. Platform-Specific Tables (8 platform × 2 tabel = 16 tabel)
--   4. Additional Columns
--   5. Indexes
--   6. Security Definer Helper Function
--   7. Row Level Security + Policies
--   8. Triggers
--   9. Seed Data
--  10. Optimize
--
-- Jalankan di Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================


-- ████████████████████████████████████████████████████████████
-- BAGIAN 1: ENUM TYPES
-- ████████████████████████████████████████████████████████████

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('admin', 'user', 'affiliate'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE platform_status AS ENUM ('active', 'inactive'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE content_type AS ENUM ('text', 'video', 'template', 'link'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE asset_type AS ENUM ('article', 'banner', 'pop_up', 'testimonial'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Tambahan enum values
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin_lead';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin_senior';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin_junior';
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'service';
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'faq';
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'contact';


-- ████████████████████████████████████████████████████████████
-- BAGIAN 2: CORE TABLES
-- ████████████████████████████████████████████████████████████

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(255) NOT NULL UNIQUE,
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  icon_url TEXT,
  status platform_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type asset_type NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  category VARCHAR(100),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ████████████████████████████████████████████████████████████
-- BAGIAN 3: PLATFORM-SPECIFIC TABLES
-- Setiap platform memiliki {platform}_issues dan {platform}_solutions
-- ████████████████████████████████████████████████████████████

-- ══════════════════════════════════════════════════════════
-- FACEBOOK
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS facebook_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS facebook_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES facebook_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- INSTAGRAM
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS instagram_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS instagram_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES instagram_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- TIKTOK
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tiktok_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tiktok_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES tiktok_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- TWITTER / X
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS twitter_x_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS twitter_x_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES twitter_x_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- YOUTUBE
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS youtube_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS youtube_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES youtube_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- WHATSAPP
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS whatsapp_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS whatsapp_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES whatsapp_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- TELEGRAM
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS telegram_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS telegram_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES telegram_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════
-- LINKEDIN
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS linkedin_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS linkedin_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES linkedin_issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  method_group VARCHAR(100) DEFAULT 'Cara 1',
  button_label VARCHAR(255),
  button_link VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ████████████████████████████████████████████████████████████
-- BAGIAN 4: KOLOM TAMBAHAN (idempotent)
-- ████████████████████████████████████████████████████████████

-- Assets: kolom display untuk card rendering
ALTER TABLE assets ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS link_url TEXT;

-- Users: affiliate tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_count INT NOT NULL DEFAULT 0;


-- ████████████████████████████████████████████████████████████
-- BAGIAN 5: INDEXES
-- ████████████████████████████████████████████████████████████

-- ── Core table indexes ──

CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_used_by ON access_codes(used_by);
CREATE INDEX IF NOT EXISTS idx_platforms_status ON platforms(status);

CREATE INDEX IF NOT EXISTS idx_assets_type_active ON assets(asset_type, is_active);
CREATE INDEX IF NOT EXISTS idx_assets_type_active_created ON assets(asset_type, is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_used ON access_codes(is_used);
CREATE INDEX IF NOT EXISTS idx_access_codes_is_used_used_by ON access_codes(is_used, used_by);
CREATE INDEX IF NOT EXISTS idx_platforms_status_name ON platforms(status, name);
CREATE INDEX IF NOT EXISTS idx_users_id_role ON users(id, role);

-- Affiliate indexes
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Partial indexes
CREATE INDEX IF NOT EXISTS idx_access_codes_available ON access_codes(code) WHERE is_used = false;
CREATE INDEX IF NOT EXISTS idx_assets_active_popup ON assets(asset_type, created_at DESC) WHERE is_active = true;

-- Articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category) WHERE is_published = true;

-- Modules indexes
CREATE INDEX IF NOT EXISTS idx_modules_published ON modules(is_published, sort_order);

-- ── Platform-specific indexes ──

CREATE INDEX IF NOT EXISTS idx_facebook_issues_status ON facebook_issues(status);
CREATE INDEX IF NOT EXISTS idx_facebook_issues_name ON facebook_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_facebook_solutions_issue ON facebook_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_facebook_solutions_method_step ON facebook_solutions(issue_id, method_group, step_number);

CREATE INDEX IF NOT EXISTS idx_instagram_issues_status ON instagram_issues(status);
CREATE INDEX IF NOT EXISTS idx_instagram_issues_name ON instagram_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_instagram_solutions_issue ON instagram_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_instagram_solutions_method_step ON instagram_solutions(issue_id, method_group, step_number);

CREATE INDEX IF NOT EXISTS idx_tiktok_issues_status ON tiktok_issues(status);
CREATE INDEX IF NOT EXISTS idx_tiktok_issues_name ON tiktok_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_tiktok_solutions_issue ON tiktok_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_solutions_method_step ON tiktok_solutions(issue_id, method_group, step_number);

CREATE INDEX IF NOT EXISTS idx_twitter_x_issues_status ON twitter_x_issues(status);
CREATE INDEX IF NOT EXISTS idx_twitter_x_issues_name ON twitter_x_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_twitter_x_solutions_issue ON twitter_x_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_twitter_x_solutions_method_step ON twitter_x_solutions(issue_id, method_group, step_number);

CREATE INDEX IF NOT EXISTS idx_youtube_issues_status ON youtube_issues(status);
CREATE INDEX IF NOT EXISTS idx_youtube_issues_name ON youtube_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_youtube_solutions_issue ON youtube_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_youtube_solutions_method_step ON youtube_solutions(issue_id, method_group, step_number);

CREATE INDEX IF NOT EXISTS idx_whatsapp_issues_status ON whatsapp_issues(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_issues_name ON whatsapp_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_whatsapp_solutions_issue ON whatsapp_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_solutions_method_step ON whatsapp_solutions(issue_id, method_group, step_number);

CREATE INDEX IF NOT EXISTS idx_telegram_issues_status ON telegram_issues(status);
CREATE INDEX IF NOT EXISTS idx_telegram_issues_name ON telegram_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_telegram_solutions_issue ON telegram_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_telegram_solutions_method_step ON telegram_solutions(issue_id, method_group, step_number);

CREATE INDEX IF NOT EXISTS idx_linkedin_issues_status ON linkedin_issues(status);
CREATE INDEX IF NOT EXISTS idx_linkedin_issues_name ON linkedin_issues(issue_name);
CREATE INDEX IF NOT EXISTS idx_linkedin_solutions_issue ON linkedin_solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_solutions_method_step ON linkedin_solutions(issue_id, method_group, step_number);


-- ████████████████████████████████████████████████████████████
-- BAGIAN 6: SECURITY DEFINER HELPER FUNCTION
-- Bypass RLS saat mengecek role user, mencegah infinite recursion
-- ████████████████████████████████████████████████████████████

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM users WHERE id = user_id;
$$ LANGUAGE sql STABLE;


-- ████████████████████████████████████████████████████████████
-- BAGIAN 7: ROW LEVEL SECURITY + POLICIES
-- Semua policies menggunakan get_user_role() untuk menghindari recursion
-- ████████████████████████████████████████████████████████████

-- Enable RLS on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Enable RLS on platform-specific tables
DO $$
DECLARE
  platform TEXT;
  tbl TEXT;
BEGIN
  FOREACH platform IN ARRAY ARRAY[
    'facebook', 'instagram', 'tiktok', 'twitter_x',
    'youtube', 'whatsapp', 'telegram', 'linkedin'
  ] LOOP
    tbl := platform || '_issues';
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);

    tbl := platform || '_solutions';
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;

-- Hapus semua policy lama terlebih dahulu (agar bisa dijalankan ulang)
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;


-- ══════════ USERS ══════════

-- User: baca profil sendiri
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (id = auth.uid());

-- User: insert profil sendiri (registrasi)
CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- Admin lead: akses penuh ke semua users
CREATE POLICY "users_admin_lead_all"
  ON users FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'));

-- Admin senior/junior: baca semua users
CREATE POLICY "users_admin_tier_select"
  ON users FOR SELECT
  USING (public.get_user_role(auth.uid()) IN ('admin_senior', 'admin_junior'));


-- ══════════ ACCESS_CODES ══════════

CREATE POLICY "access_codes_admin_lead_all"
  ON access_codes FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'));

CREATE POLICY "access_codes_admin_senior_select"
  ON access_codes FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_senior');

CREATE POLICY "access_codes_user_select"
  ON access_codes FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_used = false OR used_by = auth.uid()));

CREATE POLICY "access_codes_user_redeem"
  ON access_codes FOR UPDATE
  USING (auth.role() = 'authenticated' AND is_used = false)
  WITH CHECK (is_used = true AND used_by = auth.uid());


-- ══════════ PLATFORMS ══════════

CREATE POLICY "platforms_admin_manage"
  ON platforms FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

CREATE POLICY "platforms_admin_junior_select"
  ON platforms FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

CREATE POLICY "platforms_user_select"
  ON platforms FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'active');


-- ══════════ ASSETS ══════════

CREATE POLICY "assets_admin_manage"
  ON assets FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'));

CREATE POLICY "assets_user_select"
  ON assets FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);


-- ══════════ ARTICLES ══════════

CREATE POLICY "articles_admin_manage"
  ON articles FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'));

CREATE POLICY "articles_user_select"
  ON articles FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- ══════════ MODULES ══════════

CREATE POLICY "modules_admin_manage"
  ON modules FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

CREATE POLICY "modules_admin_junior_select"
  ON modules FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

CREATE POLICY "modules_user_select"
  ON modules FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- ══════════ PLATFORM-SPECIFIC POLICIES ══════════
-- Menggunakan loop untuk menghindari duplikasi

DO $$
DECLARE
  platform TEXT;
  tbl_issues TEXT;
  tbl_solutions TEXT;
BEGIN
  FOREACH platform IN ARRAY ARRAY[
    'facebook', 'instagram', 'tiktok', 'twitter_x',
    'youtube', 'whatsapp', 'telegram', 'linkedin'
  ] LOOP
    tbl_issues := platform || '_issues';
    tbl_solutions := platform || '_solutions';

    -- ═══ ISSUES POLICIES ═══

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL
       USING (public.get_user_role(auth.uid()) IN (''admin'', ''admin_lead'', ''admin_senior''))
       WITH CHECK (public.get_user_role(auth.uid()) IN (''admin'', ''admin_lead'', ''admin_senior''))',
      platform || '_issues_admin_manage', tbl_issues
    );

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT
       USING (public.get_user_role(auth.uid()) = ''admin_junior'')',
      platform || '_issues_admin_junior_select', tbl_issues
    );

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT
       USING (auth.role() = ''authenticated'' AND status = ''active'')',
      platform || '_issues_user_select', tbl_issues
    );

    -- ═══ SOLUTIONS POLICIES ═══

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR ALL
       USING (public.get_user_role(auth.uid()) IN (''admin'', ''admin_lead'', ''admin_senior''))
       WITH CHECK (public.get_user_role(auth.uid()) IN (''admin'', ''admin_lead'', ''admin_senior''))',
      platform || '_solutions_admin_manage', tbl_solutions
    );

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT
       USING (public.get_user_role(auth.uid()) = ''admin_junior'')',
      platform || '_solutions_admin_junior_select', tbl_solutions
    );

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT
       USING (auth.role() = ''authenticated'')',
      platform || '_solutions_user_select', tbl_solutions
    );

  END LOOP;
END $$;


-- ████████████████████████████████████████████████████████████
-- BAGIAN 8: TRIGGERS
-- ████████████████████████████████████████████████████████████

-- Affiliate Referral Code Auto-Generate
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'affiliate' AND (NEW.referral_code IS NULL OR NEW.referral_code = '') THEN
    NEW.referral_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NEW.id::TEXT) FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_referral_code ON users;
CREATE TRIGGER trg_generate_referral_code
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_code();

-- Auto-populate public.users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ████████████████████████████████████████████████████████████
-- BAGIAN 9: SEED DATA (hanya jika tabel kosong)
-- ████████████████████████████████████████████████████████████

INSERT INTO platforms (name, icon_url, status)
SELECT * FROM (VALUES
  ('Facebook',    'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg',  'active'::platform_status),
  ('Instagram',   'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg', 'active'::platform_status),
  ('TikTok',      'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg',    'active'::platform_status),
  ('Twitter / X', 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg',         'active'::platform_status),
  ('YouTube',     'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg',   'active'::platform_status),
  ('WhatsApp',    'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg',  'active'::platform_status),
  ('Telegram',    'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/telegram.svg',  'active'::platform_status),
  ('LinkedIn',    'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg',  'active'::platform_status)
) AS v(name, icon_url, status)
WHERE NOT EXISTS (SELECT 1 FROM platforms LIMIT 1);


-- ████████████████████████████████████████████████████████████
-- BAGIAN 10: OPTIMIZE + VERIFY
-- ████████████████████████████████████████████████████████████

ANALYZE users;
ANALYZE access_codes;
ANALYZE platforms;
ANALYZE assets;
ANALYZE articles;
ANALYZE modules;
ANALYZE facebook_issues;
ANALYZE facebook_solutions;
ANALYZE instagram_issues;
ANALYZE instagram_solutions;
ANALYZE tiktok_issues;
ANALYZE tiktok_solutions;
ANALYZE twitter_x_issues;
ANALYZE twitter_x_solutions;
ANALYZE youtube_issues;
ANALYZE youtube_solutions;
ANALYZE whatsapp_issues;
ANALYZE whatsapp_solutions;
ANALYZE telegram_issues;
ANALYZE telegram_solutions;
ANALYZE linkedin_issues;
ANALYZE linkedin_solutions;

-- Verification
DO $$
DECLARE
  core_count INT;
  platform_count INT;
  policy_count INT;
BEGIN
  SELECT COUNT(*) INTO core_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('users', 'access_codes', 'platforms', 'assets', 'articles', 'modules');

  SELECT COUNT(*) INTO platform_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND (table_name LIKE '%_issues' OR table_name LIKE '%_solutions');

  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public';

  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '✅ Core tables: % (expected 6)', core_count;
  RAISE NOTICE '✅ Platform tables: % (expected 16)', platform_count;
  RAISE NOTICE '✅ Total RLS policies: %', policy_count;
  RAISE NOTICE '═══════════════════════════════════════';

  IF core_count < 6 THEN
    RAISE WARNING '⚠ Expected 6 core tables, got %. Check for errors above.', core_count;
  END IF;

  IF platform_count < 16 THEN
    RAISE WARNING '⚠ Expected 16 platform tables, got %. Check for errors above.', platform_count;
  END IF;
END $$;


-- ============================================================
-- ✅ SELESAI. Database Mediea Solution telah dikonfigurasi.
--
-- Core tables: users, access_codes, platforms, assets, articles, modules
-- Platform tables: 8 platform × 2 tabel (issues + solutions) = 16 tabel
-- Semua RLS policies menggunakan get_user_role() (no recursion)
-- Triggers: handle_new_user, generate_referral_code
-- ============================================================
