-- ============================================================
-- MEDIEA SOLUTION — Migration 001: Articles & Modules Tables
-- Jalankan di Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Tambah enum value baru untuk asset_type
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'faq';
ALTER TYPE asset_type ADD VALUE IF NOT EXISTS 'contact';


-- ████████████████████████████████████████████████████████████
-- TABEL: articles
-- ████████████████████████████████████████████████████████████

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

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category) WHERE is_published = true;


-- ████████████████████████████████████████████████████████████
-- TABEL: modules
-- ████████████████████████████████████████████████████████████

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

CREATE INDEX IF NOT EXISTS idx_modules_published ON modules(is_published, sort_order);


-- ████████████████████████████████████████████████████████████
-- RLS: articles
-- ████████████████████████████████████████████████████████████

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Admin lead: full access
CREATE POLICY "Admin lead manage articles"
  ON articles FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

-- Admin senior: full access
CREATE POLICY "Admin senior manage articles"
  ON articles FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_senior'));

-- Admin junior: full access (articles are safe for junior admins)
CREATE POLICY "Admin junior manage articles"
  ON articles FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_junior'));

-- Users: read published only
CREATE POLICY "Users read published articles"
  ON articles FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- ████████████████████████████████████████████████████████████
-- RLS: modules
-- ████████████████████████████████████████████████████████████

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Admin lead: full access
CREATE POLICY "Admin lead manage modules"
  ON modules FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin','admin_lead')));

-- Admin senior: full access
CREATE POLICY "Admin senior manage modules"
  ON modules FOR ALL
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_senior'));

-- Admin junior: read only
CREATE POLICY "Admin junior read modules"
  ON modules FOR SELECT
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin_junior'));

-- Users: read published only
CREATE POLICY "Users read published modules"
  ON modules FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- ████████████████████████████████████████████████████████████
-- OPTIMIZE
-- ████████████████████████████████████████████████████████████

ANALYZE articles;
ANALYZE modules;

-- ============================================================
-- ✅ Migration 001 selesai.
-- ============================================================
