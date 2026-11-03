-- ============================================================
-- 001 — Kunci tabel access_codes, galeri media, foto langkah landing
-- Sudah diterapkan ke project Supabase "medieasolution" (2026-11-03).
-- Idempotent: aman dijalankan ulang.
-- ============================================================

-- ——— access_codes: user hanya melihat kode miliknya; redeem lewat server (service role) ———
DROP POLICY IF EXISTS "Authenticated users can read access_codes" ON public.access_codes;
DROP POLICY IF EXISTS "Authenticated users can update access_codes" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_user_redeem" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_user_select" ON public.access_codes;
DROP POLICY IF EXISTS "access_codes_user_select_own" ON public.access_codes;

CREATE POLICY "access_codes_user_select_own"
  ON public.access_codes FOR SELECT
  TO authenticated
  USING (used_by = auth.uid());

-- ——— Storage bucket "media" untuk menu Gallery di admin ———
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "media_admin_select" ON storage.objects;
DROP POLICY IF EXISTS "media_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "media_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "media_admin_delete" ON storage.objects;

CREATE POLICY "media_admin_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.get_user_role(auth.uid()) IN ('admin','admin_lead','admin_senior','admin_junior'));
CREATE POLICY "media_admin_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.get_user_role(auth.uid()) IN ('admin','admin_lead','admin_senior'));
CREATE POLICY "media_admin_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.get_user_role(auth.uid()) IN ('admin','admin_lead','admin_senior'));
CREATE POLICY "media_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.get_user_role(auth.uid()) IN ('admin','admin_lead','admin_senior'));

-- ——— Foto langkah "Cara Kerja" (assets: asset_type 'service', title 'step-N') terbaca publik ———
DROP POLICY IF EXISTS "assets_public_service_select" ON public.assets;
CREATE POLICY "assets_public_service_select"
  ON public.assets FOR SELECT
  TO anon, authenticated
  USING (asset_type = 'service' AND is_active = true);
