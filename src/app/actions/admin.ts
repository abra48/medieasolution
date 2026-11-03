"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdminRole, isAdminSeniorOrAbove } from "@/lib/admin-roles";
import { getIssuesTable, getSolutionsTable, getPlatformSlug } from "@/lib/platform-tables";
import { LANDING_STEP_COUNT, landingStepKey } from "@/lib/landing-steps";

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

export type ActionResult = { success?: boolean; error?: string; message?: string } | null;

function text(formData: FormData, key: string): string {
  return ((formData.get(key) as string | null) ?? "").trim();
}

function textOrNull(formData: FormData, key: string): string | null {
  return text(formData, key) || null;
}

function assertKnownPlatform(platformName: string) {
  try {
    getPlatformSlug(platformName);
  } catch {
    throw new Error(`Platform "${platformName}" tidak dikenali sistem.`);
  }
}

/* ═══════════════════════════════
   PLATFORMS
   ═══════════════════════════════ */
export async function createPlatform(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const name = text(formData, "name");
    const icon_url = textOrNull(formData, "icon_url");
    const status = text(formData, "status") || "active";

    if (!name) return { error: "Nama platform wajib diisi." };

    const { error } = await supabase.from("platforms").insert({ name, icon_url, status });
    if (error) return { error: error.message };

    revalidatePath("/admin/platforms");
    return { success: true, message: `Platform "${name}" berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updatePlatform(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const id = text(formData, "id");
    const name = text(formData, "name");
    if (!id) return { error: "ID platform tidak valid." };
    if (!name) return { error: "Nama platform wajib diisi." };

    const { error } = await supabase
      .from("platforms")
      .update({ name, icon_url: textOrNull(formData, "icon_url"), status: text(formData, "status") || "active" })
      .eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/platforms");
    revalidatePath("/portal/troubleshoot");
    return { success: true, message: `Platform "${name}" berhasil diperbarui.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deletePlatform(id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
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
function issueFields(formData: FormData) {
  return {
    issue_name: text(formData, "issue_name"),
    description: textOrNull(formData, "description"),
    issue_name_en: textOrNull(formData, "issue_name_en"),
    description_en: textOrNull(formData, "description_en"),
    status: text(formData, "status") || "active",
  };
}

export async function createIssue(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const platform_name = text(formData, "platform_name");
    const fields = issueFields(formData);

    if (!platform_name) return { error: "Platform wajib dipilih." };
    if (!fields.issue_name) return { error: "Nama kendala wajib diisi." };
    assertKnownPlatform(platform_name);

    const { error } = await supabase.from(getIssuesTable(platform_name)).insert(fields);
    if (error) return { error: error.message };

    revalidatePath("/admin/issues");
    return { success: true, message: `Kendala "${fields.issue_name}" berhasil ditambahkan ke ${platform_name}.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updateIssue(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const platform_name = text(formData, "platform_name");
    const id = text(formData, "id");
    const fields = issueFields(formData);

    if (!platform_name || !id) return { error: "Data kendala tidak valid." };
    if (!fields.issue_name) return { error: "Nama kendala wajib diisi." };
    assertKnownPlatform(platform_name);

    const { error } = await supabase.from(getIssuesTable(platform_name)).update(fields).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/issues");
    return { success: true, message: `Kendala "${fields.issue_name}" berhasil diperbarui.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteIssue(platformName: string, id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const { error } = await supabase.from(getIssuesTable(platformName)).delete().eq("id", id);
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
const MAX_BUTTONS = 3;

function solutionFields(formData: FormData) {
  const step_number = parseInt(text(formData, "step_number"), 10);
  const content_type = text(formData, "content_type");
  const content_data = text(formData, "content_data");

  // Up to 3 buttons, stored pipe-separated in button_label / button_link
  const labels: string[] = [];
  const links: string[] = [];
  for (let i = 1; i <= MAX_BUTTONS; i++) {
    const label = text(formData, `button_label_${i}`).replaceAll("|", "/");
    const link = text(formData, `button_link_${i}`).replaceAll("|", "%7C");
    if (label && link) {
      labels.push(label);
      links.push(link);
    } else if (label || link) {
      throw new Error(`Tombol ${i}: isi label dan URL, atau kosongkan keduanya.`);
    }
  }

  if (!step_number || step_number < 1) throw new Error("Nomor langkah tidak valid.");
  if (!content_type) throw new Error("Tipe konten wajib dipilih.");
  if (!content_data) throw new Error("Konten wajib diisi.");

  return {
    issue_id: text(formData, "issue_id"),
    step_number,
    content_type,
    content_data,
    content_data_en: textOrNull(formData, "content_data_en"),
    method_group: text(formData, "method_group") || "Cara 1",
    button_label: labels.length ? labels.join("|") : null,
    button_link: links.length ? links.join("|") : null,
  };
}

export async function createSolution(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const platform_name = text(formData, "platform_name");
    if (!platform_name) return { error: "Platform wajib dipilih." };
    assertKnownPlatform(platform_name);

    const fields = solutionFields(formData);
    if (!fields.issue_id) return { error: "Kendala wajib dipilih." };

    const { error } = await supabase.from(getSolutionsTable(platform_name)).insert(fields);
    if (error) return { error: error.message };

    revalidatePath("/admin/solutions");
    return { success: true, message: `Langkah ${fields.step_number} berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updateSolution(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const platform_name = text(formData, "platform_name");
    const id = text(formData, "id");
    if (!platform_name || !id) return { error: "Data langkah tidak valid." };
    assertKnownPlatform(platform_name);

    const fields = solutionFields(formData);
    if (!fields.issue_id) return { error: "Kendala wajib dipilih." };

    const { error } = await supabase.from(getSolutionsTable(platform_name)).update(fields).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/solutions");
    return { success: true, message: `Langkah ${fields.step_number} berhasil diperbarui.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteSolution(platformName: string, id: string): Promise<ActionResult> {
  try {
    const supabase = await verifyAdminSenior();
    const { error } = await supabase.from(getSolutionsTable(platformName)).delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/solutions");
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

/* ═══════════════════════════════
   LANDING STEP IMAGES (assets: asset_type "service", title "step-N")
   ═══════════════════════════════ */
export async function setLandingStepImage(step: number, imageUrl: string | null): Promise<ActionResult> {
  try {
    const supabase = await verifyAdmin();
    if (!Number.isInteger(step) || step < 1 || step > LANDING_STEP_COUNT) {
      return { error: "Nomor langkah tidak valid." };
    }
    const key = landingStepKey(step);

    const { error: deleteError } = await supabase
      .from("assets")
      .delete()
      .eq("asset_type", "service")
      .eq("title", key);
    if (deleteError) return { error: deleteError.message };

    if (imageUrl) {
      const { error } = await supabase.from("assets").insert({
        asset_type: "service",
        title: key,
        content: "",
        image_url: imageUrl,
        is_active: true,
      });
      if (error) return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true, message: imageUrl ? `Foto langkah ${step} disimpan.` : `Foto langkah ${step} dihapus.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
