-- ============================================================
-- MEDIEA SOLUTION — Complete Database Setup
-- Satu file tunggal. Bisa dijalankan ulang tanpa error.
-- ============================================================
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


-- ████████████████████████████████████████████████████████████
-- BAGIAN 2: TABEL
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

CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  issue_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  content_type content_type NOT NULL,
  content_data TEXT NOT NULL,
  shortcut_url VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type asset_type NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ████████████████████████████████████████████████████████████
-- BAGIAN 3: KOLOM TAMBAHAN (idempotent)
-- ████████████████████████████████████████████████████████████

-- Solutions: method_group untuk tab Cara 1 / Cara 2
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS method_group VARCHAR(100) DEFAULT 'Cara 1';

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
-- BAGIAN 4: INDEXES (semua IF NOT EXISTS)
-- ████████████████████████████████████████████████████████████

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_used_by ON access_codes(used_by);
CREATE INDEX IF NOT EXISTS idx_issues_platform_id ON issues(platform_id);
CREATE INDEX IF NOT EXISTS idx_solutions_issue_id ON solutions(issue_id);
CREATE INDEX IF NOT EXISTS idx_platforms_status ON platforms(status);

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_solutions_method_step ON solutions(issue_id, method_group, step_number);
CREATE INDEX IF NOT EXISTS idx_issues_platform_name ON issues(platform_id, issue_name);
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

-- Partial indexes (performa tinggi)
CREATE INDEX IF NOT EXISTS idx_access_codes_available ON access_codes(code) WHERE is_used = false;
CREATE INDEX IF NOT EXISTS idx_assets_active_popup ON assets(asset_type, created_at DESC) WHERE is_active = true;


-- ████████████████████████████████████████████████████████████
-- BAGIAN 5: ROW LEVEL SECURITY
-- ████████████████████████████████████████████████████████████

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Hapus semua policy lama terlebih dahulu (agar bisa dijalankan ulang)
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('users','access_codes','platforms','issues','solutions','assets')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ══════════ USERS ══════════
-- Admin (legacy) + admin_lead: akses penuh
CREATE POLICY "Admin full access users"
  ON users FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

-- Admin senior/junior: hanya baca
CREATE POLICY "Admin tier read users"
  ON users FOR SELECT
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin_senior','admin_junior')));

-- User biasa: lihat profil sendiri
CREATE POLICY "Users read own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

-- User biasa: insert profil sendiri saat registrasi
CREATE POLICY "Users insert own profile"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- ══════════ ACCESS_CODES ══════════
-- HANYA admin/admin_lead yang bisa generate & kelola kode
CREATE POLICY "Admin lead manage codes"
  ON access_codes FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

-- User: hanya bisa lihat kode yang belum dipakai ATAU kode milik sendiri
CREATE POLICY "Users lookup codes"
  ON access_codes FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_used = false OR used_by = auth.uid()));

-- User: hanya bisa redeem kode (ubah is_used ke true, used_by ke diri sendiri)
CREATE POLICY "Users redeem code"
  ON access_codes FOR UPDATE
  USING (auth.role() = 'authenticated' AND is_used = false)
  WITH CHECK (is_used = true AND used_by = auth.uid());

-- ══════════ PLATFORMS ══════════
-- Admin/lead: akses penuh
CREATE POLICY "Admin lead manage platforms"
  ON platforms FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

-- Admin senior: akses penuh
CREATE POLICY "Admin senior manage platforms"
  ON platforms FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_senior'));

-- Admin junior: hanya baca
CREATE POLICY "Admin junior read platforms"
  ON platforms FOR SELECT
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_junior'));

-- User biasa: hanya baca platform yang aktif
CREATE POLICY "Users read active platforms"
  ON platforms FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'active');

-- ══════════ ISSUES ══════════
CREATE POLICY "Admin lead manage issues"
  ON issues FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

CREATE POLICY "Admin senior manage issues"
  ON issues FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_senior'));

CREATE POLICY "Admin junior read issues"
  ON issues FOR SELECT
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_junior'));

CREATE POLICY "Users read issues"
  ON issues FOR SELECT
  USING (auth.role() = 'authenticated');

-- ══════════ SOLUTIONS ══════════
CREATE POLICY "Admin lead manage solutions"
  ON solutions FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

CREATE POLICY "Admin senior manage solutions"
  ON solutions FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_senior'));

CREATE POLICY "Admin junior read solutions"
  ON solutions FOR SELECT
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_junior'));

CREATE POLICY "Users read solutions"
  ON solutions FOR SELECT
  USING (auth.role() = 'authenticated');

-- ══════════ ASSETS ══════════
CREATE POLICY "Admin lead manage assets"
  ON assets FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

CREATE POLICY "Admin senior manage assets"
  ON assets FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_senior'));

CREATE POLICY "Admin junior manage assets"
  ON assets FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_junior'));

CREATE POLICY "Users read active assets"
  ON assets FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);


-- ████████████████████████████████████████████████████████████
-- BAGIAN 6: TRIGGER (Affiliate Referral Code Auto-Generate)
-- ████████████████████████████████████████████████████████████

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


-- ████████████████████████████████████████████████████████████
-- BAGIAN 6B: TRIGGER (Auto-populate public.users on signup)
-- ████████████████████████████████████████████████████████████

-- SECURITY DEFINER agar bypass RLS — trigger jalan sebagai owner function
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
-- BAGIAN 7: SEED DATA (hanya jika tabel kosong)
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
-- BAGIAN 8: OPTIMIZE
-- ████████████████████████████████████████████████████████████

ANALYZE users;
ANALYZE access_codes;
ANALYZE platforms;
ANALYZE issues;
ANALYZE solutions;
ANALYZE assets;


-- ============================================================
-- ✅ SELESAI. Semua tabel, kolom, index, RLS, dan seed data
--    sudah dikonfigurasi.
-- ============================================================
