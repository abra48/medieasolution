-- ============================================================
-- FIX: RLS infinite recursion on users table
-- 
-- The problem: policies on "users" table reference "users" table
-- itself (checking role), causing infinite recursion.
-- 
-- Solution: Use auth.uid() directly and use SECURITY DEFINER
-- helper functions to break the recursion chain.
-- ============================================================

-- Step 1: Create a SECURITY DEFINER helper function
-- This bypasses RLS when checking role, breaking the recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT FROM users WHERE id = user_id;
$$ LANGUAGE sql STABLE;

-- Step 2: Drop ALL existing policies on users table
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON users', r.policyname);
  END LOOP;
END $$;

-- Step 3: Recreate policies WITHOUT self-referencing users table

-- Users can always read their own profile
CREATE POLICY "Users read own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Users can insert their own profile (registration)
CREATE POLICY "Users insert own profile"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- Admin lead: full access (uses helper function, no recursion)
CREATE POLICY "Admin full access users"
  ON users FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'));

-- Admin senior/junior: read all users
CREATE POLICY "Admin tier read users"
  ON users FOR SELECT
  USING (public.get_user_role(auth.uid()) IN ('admin_senior', 'admin_junior'));


-- ============================================================
-- Also fix policies on OTHER tables that reference users table
-- These also cause issues when users table has RLS problems
-- ============================================================

-- Fix access_codes policies
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'access_codes') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON access_codes', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admin lead manage codes"
  ON access_codes FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead'));

CREATE POLICY "Users lookup codes"
  ON access_codes FOR SELECT
  USING (auth.role() = 'authenticated' AND (is_used = false OR used_by = auth.uid()));

CREATE POLICY "Users redeem code"
  ON access_codes FOR UPDATE
  USING (auth.role() = 'authenticated' AND is_used = false)
  WITH CHECK (is_used = true AND used_by = auth.uid());


-- Fix platforms policies
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'platforms') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON platforms', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admin manage platforms"
  ON platforms FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

CREATE POLICY "Admin junior read platforms"
  ON platforms FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

CREATE POLICY "Users read active platforms"
  ON platforms FOR SELECT
  USING (auth.role() = 'authenticated' AND status = 'active');


-- Fix issues policies
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'issues') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON issues', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admin manage issues"
  ON issues FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

CREATE POLICY "Admin junior read issues"
  ON issues FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

CREATE POLICY "Users read issues"
  ON issues FOR SELECT
  USING (auth.role() = 'authenticated');


-- Fix solutions policies
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'solutions') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON solutions', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admin manage solutions"
  ON solutions FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

CREATE POLICY "Admin junior read solutions"
  ON solutions FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

CREATE POLICY "Users read solutions"
  ON solutions FOR SELECT
  USING (auth.role() = 'authenticated');


-- Fix assets policies
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'assets') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON assets', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admin manage assets"
  ON assets FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'));

CREATE POLICY "Users read active assets"
  ON assets FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = true);


-- Fix articles policies (from migration 001)
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'articles') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON articles', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admin manage articles"
  ON articles FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior', 'admin_junior'));

CREATE POLICY "Users read published articles"
  ON articles FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- Fix modules policies (from migration 001)
DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'modules') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON modules', r.policyname);
  END LOOP;
END $$;

CREATE POLICY "Admin manage modules"
  ON modules FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'admin_lead', 'admin_senior'));

CREATE POLICY "Admin junior read modules"
  ON modules FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin_junior');

CREATE POLICY "Users read published modules"
  ON modules FOR SELECT
  USING (auth.role() = 'authenticated' AND is_published = true);


-- ============================================================
-- ✅ RLS fix complete. All policies now use get_user_role()
--    helper function instead of self-referencing queries.
-- ============================================================
