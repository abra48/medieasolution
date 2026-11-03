import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/* ——— Foto untuk langkah "Cara Kerja" di landing (disimpan di tabel assets) ——— */

export const LANDING_STEP_COUNT = 4;

export function landingStepKey(step: number) {
  return `step-${step}`;
}

/** Map nomor langkah (1..4) → URL foto. Aman dipanggil saat build tanpa env. */
export async function getLandingStepImages(): Promise<Record<number, string>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return {};

  try {
    const supabase = createSupabaseClient(url, key, { auth: { persistSession: false } });
    const { data } = await supabase
      .from("assets")
      .select("title, image_url")
      .eq("asset_type", "service")
      .eq("is_active", true)
      .like("title", "step-%");

    const images: Record<number, string> = {};
    for (const row of data ?? []) {
      const step = Number(String(row.title).replace("step-", ""));
      if (step >= 1 && step <= LANDING_STEP_COUNT && row.image_url) images[step] = row.image_url;
    }
    return images;
  } catch {
    return {};
  }
}
