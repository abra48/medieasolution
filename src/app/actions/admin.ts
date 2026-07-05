"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdminRole, isAdminSeniorOrAbove, isAdminLead } from "@/lib/admin-roles";
import { getIssuesTable, getSolutionsTable, getPlatformSlug } from "@/lib/platform-tables";

/* ——— Tiered admin verification ——— */
async function getAdminProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Autentikasi diperlukan.");
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  return { supabase, role: profile?.role };
}

/** Any admin tier */
async function verifyAdmin() {
  const { supabase, role } = await getAdminProfile();
  if (!isAdminRole(role)) throw new Error("Akses ditolak. Kredensial tidak valid.");
  return supabase;
}

/** Senior or Lead only */
async function verifyAdminSenior() {
  const { supabase, role } = await getAdminProfile();
  if (!isAdminSeniorOrAbove(role)) throw new Error("Akses ditolak. Hak akses Senior atau Lead diperlukan.");
  return supabase;
}

/** Lead only */
async function verifyAdminLead() {
  const { supabase, role } = await getAdminProfile();
  if (!isAdminLead(role)) throw new Error("Akses ditolak. Hak akses Lead diperlukan.");
  return supabase;
}

export type ActionResult = { success?: boolean; error?: string; message?: string } | null;

/* ═══════════════════════════════
   PLATFORMS
   ═══════════════════════════════ */
export async function createPlatform(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const name = (formData.get("name") as string)?.trim();
    const icon_url = (formData.get("icon_url") as string)?.trim() || null;
    const status = (formData.get("status") as string) || "active";

    if (!name) return { error: "Nama platform wajib diisi." };

    const { error } = await supabase.from("platforms").insert({ name, icon_url, status });
    if (error) return { error: error.message };

    revalidatePath("/admin/platforms");
    return { success: true, message: `Platform "${name}" berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deletePlatform(id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from("platforms").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/platforms");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/* ═══════════════════════════════
   ISSUES (Platform-Isolated)
   ═══════════════════════════════ */
export async function createIssue(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const platform_name = (formData.get("platform_name") as string)?.trim();
    const issue_name = (formData.get("issue_name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;

    if (!platform_name) return { error: "Platform wajib dipilih." };
    if (!issue_name) return { error: "Nama kendala wajib diisi." };

    // Validate platform slug
    try {
      getPlatformSlug(platform_name);
    } catch {
      return { error: `Platform "${platform_name}" tidak dikenali sistem.` };
    }

    const tableName = getIssuesTable(platform_name);
    const { error } = await supabase.from(tableName).insert({ issue_name, description });
    if (error) return { error: error.message };

    revalidatePath("/admin/issues");
    return { success: true, message: `Kendala "${issue_name}" berhasil ditambahkan ke ${platform_name}.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteIssue(platformName: string, id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const tableName = getIssuesTable(platformName);
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/issues");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/* ═══════════════════════════════
   SOLUTIONS (Platform-Isolated)
   ═══════════════════════════════ */
export async function createSolution(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const platform_name = (formData.get("platform_name") as string)?.trim();
    const issue_id = formData.get("issue_id") as string;
    const step_number = parseInt(formData.get("step_number") as string, 10);
    const content_type = formData.get("content_type") as string;
    const content_data = (formData.get("content_data") as string)?.trim();
    const method_group = (formData.get("method_group") as string)?.trim() || "Cara 1";
    const button_label = (formData.get("button_label") as string)?.trim() || null;
    const button_link = (formData.get("button_link") as string)?.trim() || null;

    if (!platform_name) return { error: "Platform wajib dipilih." };
    if (!issue_id) return { error: "Kendala wajib dipilih." };
    if (!step_number || step_number < 1) return { error: "Nomor langkah tidak valid." };
    if (!content_type) return { error: "Tipe konten wajib dipilih." };
    if (!content_data) return { error: "Konten wajib diisi." };

    // Validate: if one button field is set, both must be set
    if ((button_label && !button_link) || (!button_label && button_link)) {
      return { error: "Nama Tombol dan Tautan Tombol harus diisi keduanya, atau keduanya dikosongkan." };
    }

    try {
      getPlatformSlug(platform_name);
    } catch {
      return { error: `Platform "${platform_name}" tidak dikenali sistem.` };
    }

    const tableName = getSolutionsTable(platform_name);
    const { error } = await supabase.from(tableName).insert({
      issue_id, step_number, content_type, content_data, method_group, button_label, button_link,
    });
    if (error) return { error: error.message };

    revalidatePath("/admin/solutions");
    return { success: true, message: `Langkah ${step_number} berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteSolution(platformName: string, id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const tableName = getSolutionsTable(platformName);
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/solutions");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
