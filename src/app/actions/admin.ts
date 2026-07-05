"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdminRole, isAdminSeniorOrAbove, isAdminLead } from "@/lib/admin-roles";

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
   ISSUES
   ═══════════════════════════════ */
export async function createIssue(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const platform_id = formData.get("platform_id") as string;
    const issue_name = (formData.get("issue_name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;

    if (!platform_id) return { error: "Platform wajib dipilih." };
    if (!issue_name) return { error: "Nama kendala wajib diisi." };

    const { error } = await supabase.from("issues").insert({ platform_id, issue_name, description });
    if (error) return { error: error.message };

    revalidatePath("/admin/issues");
    return { success: true, message: `Kendala "${issue_name}" berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteIssue(id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from("issues").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/issues");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/* ═══════════════════════════════
   SOLUTIONS
   ═══════════════════════════════ */
export async function createSolution(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const issue_id = formData.get("issue_id") as string;
    const step_number = parseInt(formData.get("step_number") as string, 10);
    const content_type = formData.get("content_type") as string;
    const content_data = (formData.get("content_data") as string)?.trim();
    const shortcut_url = (formData.get("shortcut_url") as string)?.trim() || null;
    const method_group = (formData.get("method_group") as string)?.trim() || "Cara 1";

    if (!issue_id) return { error: "Kendala wajib dipilih." };
    if (!step_number || step_number < 1) return { error: "Nomor langkah tidak valid." };
    if (!content_type) return { error: "Tipe konten wajib dipilih." };
    if (!content_data) return { error: "Konten wajib diisi." };

    const { error } = await supabase.from("solutions").insert({
      issue_id, step_number, content_type, content_data, shortcut_url, method_group,
    });
    if (error) return { error: error.message };

    revalidatePath("/admin/solutions");
    return { success: true, message: `Langkah ${step_number} berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteSolution(id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from("solutions").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/solutions");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
