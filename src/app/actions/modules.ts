"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdminSeniorOrAbove } from "@/lib/admin-roles";

export type ModuleActionState = {
  success?: boolean;
  error?: string;
  message?: string;
} | null;

async function verifyAdminForModules() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Autentikasi diperlukan.");
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (!isAdminSeniorOrAbove(profile?.role)) throw new Error("Akses ditolak. Hak akses Senior atau Lead diperlukan.");
  return supabase;
}

export async function createModule(
  _prevState: ModuleActionState,
  formData: FormData
): Promise<ModuleActionState> {
  try {
    const supabase = await verifyAdminForModules();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const content = (formData.get("content") as string)?.trim() || "";
    const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
    const is_published = formData.get("is_published") === "true";

    if (!title) return { error: "Judul modul wajib diisi." };

    const { error } = await supabase.from("modules").insert({
      title, description, content, sort_order, is_published,
    });
    if (error) return { error: error.message };

    revalidatePath("/admin/modules");
    revalidatePath("/portal/modules");
    return { success: true, message: `Modul "${title}" berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updateModule(
  id: string,
  formData: FormData
): Promise<ModuleActionState> {
  try {
    const supabase = await verifyAdminForModules();
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const content = (formData.get("content") as string)?.trim() || "";
    const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
    const is_published = formData.get("is_published") === "true";

    if (!title) return { error: "Judul modul wajib diisi." };

    const { error } = await supabase.from("modules").update({
      title, description, content, sort_order, is_published, updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/modules");
    revalidatePath("/portal/modules");
    return { success: true, message: `Modul "${title}" berhasil diperbarui.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteModule(id: string): Promise<ModuleActionState> {
  try {
    const supabase = await verifyAdminForModules();
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/modules");
    revalidatePath("/portal/modules");
    return { success: true, message: "Modul berhasil dihapus." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
