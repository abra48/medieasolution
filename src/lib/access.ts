import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdminRole } from "@/lib/admin-roles";

/**
 * Akses premium terikat ke akun: sekali kode dipakai (used_by = user.id),
 * akun tersebut selamanya punya akses tanpa perlu memasukkan kode lagi.
 */
export async function hasPremiumAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (isAdminRole(profile?.role)) return true;

  // limit(1) + maybeSingle: tidak error walau akun punya lebih dari satu kode
  const { data: activeCode } = await supabase
    .from("access_codes")
    .select("id")
    .eq("used_by", userId)
    .eq("is_used", true)
    .limit(1)
    .maybeSingle();

  return !!activeCode;
}
