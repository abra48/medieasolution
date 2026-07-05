-- ============================================================
-- MEDIEA SOLUTION — Migration 003: Fix ALL RLS for Admin Access
-- 
-- MASALAH: Admin tidak bisa menambah/mengubah/menghapus data
-- karena RLS policies menggunakan self-referencing query pada
-- tabel users yang menyebabkan infinite recursion atau akses ditolak.
--
-- SOLUSI: Gunakan SECURITY DEFINER function get_user_role()
-- untuk semua policy checks, menghindari recursion.
--
-- Jalankan di Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================


-- ████████████████████████████████████████████████████████████
-- STEP 1: Create/Replace helper function (SECURITY DEFINER)
-- Fungsi ini bypass RLS saat mengecek role user
-- ████████████████████████████████████████████████████████████

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM users WHERE id = user_id;
$$ LANGUAGE sql STABLE;


-- ████████████████████████████████████████████████████████████
-- STEP 2: Drop ALL existing policies on ALL tables
-- ████████████████████████████████████████████████████████████

DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('users','access_codes','platforms','issues','solutions','assets','articles','modules')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;


-- ████████████████████████████████████████████████████████████
-- STEP 3: Recreate ALL policies using get_user_role()
-- ████████████████████████████████████████████████████████████


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

-- Admin lead: akses penuh (generate & kelola kode)
CREATE POLICY "access_codes_admin_lead_all"
  ON access_codes FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'));

-- Admin senior: baca kode
CREATE POLICY "access_codes_admin_senior_select"
  ON access_codes FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_senior');

-- User: lihat kode yang belum dipakai ATAU kode milik sendiri
CREATE POLICY "access_codes_user_select"
  ON access_codes FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_used = false OR used_by = auth.uid()));

-- User: redeem kode
CREATE POLICY "access_codes_user_redeem"
  ON access_codes FOR UPDATE
  USING (auth.role() = 'authenticated' AND is_used = false)
  WITH CHECK (is_used = true AND used_by = auth.uid());


-- ══════════ PLATFORMS ══════════

-- Admin lead/senior: akses penuh
CREATE POLICY "platforms_admin_manage"
  ON platforms FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

-- Admin junior: baca saja
CREATE POLICY "platforms_admin_junior_select"
  ON platforms FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

-- User: baca platform aktif
CREATE POLICY "platforms_user_select"
  ON platforms FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'active');


-- ══════════ ISSUES ══════════

-- Admin lead/senior: akses penuh
CREATE POLICY "issues_admin_manage"
  ON issues FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

-- Admin junior: baca saja
CREATE POLICY "issues_admin_junior_select"
  ON issues FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

-- User: baca semua issues
CREATE POLICY "issues_user_select"
  ON issues FOR SELECT
  USING (auth.role() = 'authenticated');


-- ══════════ SOLUTIONS ══════════

-- Admin lead/senior: akses penuh
CREATE POLICY "solutions_admin_manage"
  ON solutions FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

-- Admin junior: baca saja
CREATE POLICY "solutions_admin_junior_select"
  ON solutions FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

-- User: baca semua solutions
CREATE POLICY "solutions_user_select"
  ON solutions FOR SELECT
  USING (auth.role() = 'authenticated');


-- ══════════ ASSETS ══════════

-- Semua admin tier: akses penuh
CREATE POLICY "assets_admin_manage"
  ON assets FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'));

-- User: baca assets aktif
CREATE POLICY "assets_user_select"
  ON assets FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);


-- ══════════ ARTICLES ══════════

-- Semua admin tier: akses penuh
CREATE POLICY "articles_admin_manage"
  ON articles FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'));

-- User: baca artikel published
CREATE POLICY "articles_user_select"
  ON articles FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- ══════════ MODULES ══════════

-- Admin lead/senior: akses penuh
CREATE POLICY "modules_admin_manage"
  ON modules FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'))
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

-- Admin junior: baca saja
CREATE POLICY "modules_admin_junior_select"
  ON modules FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

-- User: baca modul published
CREATE POLICY "modules_user_select"
  ON modules FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- ████████████████████████████████████████████████████████████
-- STEP 4: Verify — check all policies are created
-- ████████████████████████████████████████████████████████████

DO $$
DECLARE
  policy_count INT;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('users','access_codes','platforms','issues','solutions','assets','articles','modules');
  
  RAISE NOTICE '✅ Total RLS policies created: %', policy_count;
  
  IF policy_count < 20 THEN
    RAISE WARNING '⚠ Expected at least 20 policies, got %. Check for errors above.', policy_count;
  END IF;
END $$;


-- ============================================================
-- ✅ Migration 003 selesai.
-- Semua RLS policies sekarang menggunakan get_user_role()
-- Admin bisa melakukan CRUD pada semua tabel sesuai tier mereka.
-- ============================================================
