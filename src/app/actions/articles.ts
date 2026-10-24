"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdminRole } from "@/lib/admin-roles";

export type ArticleActionState = {
  success?: boolean;
  error?: string;
  message?: string;
} | null;

async function verifyAdminForArticles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Autentikasi diperlukan.");
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (!isAdminRole(profile?.role)) throw new Error("Akses ditolak.");
  return supabase;
}

export async function createArticle(
  _prevState: ArticleActionState,
  formData: FormData
): Promise<ArticleActionState> {
  try {
    const supabase = await verifyAdminForArticles();
    const title = (formData.get("title") as string)?.trim();
    const excerpt = (formData.get("excerpt") as string)?.trim() || null;
    const content = (formData.get("content") as string)?.trim() || "";
    const category = (formData.get("category") as string)?.trim() || null;
    const is_published = formData.get("is_published") === "true";

    if (!title) return { error: "Judul artikel wajib diisi." };

    const { error } = await supabase.from("articles").insert({
      title, excerpt, content, category, is_published,
    });
    if (error) return { error: error.message };

    revalidatePath("/admin/articles");
    revalidatePath("/portal/articles");
    return { success: true, message: `Artikel "${title}" berhasil ditambahkan.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function updateArticle(
  id: string,
  formData: FormData
): Promise<ArticleActionState> {
  try {
    const supabase = await verifyAdminForArticles();
    const title = (formData.get("title") as string)?.trim();
    const excerpt = (formData.get("excerpt") as string)?.trim() || null;
    const content = (formData.get("content") as string)?.trim() || "";
    const category = (formData.get("category") as string)?.trim() || null;
    const is_published = formData.get("is_published") === "true";

    if (!title) return { error: "Judul artikel wajib diisi." };

    const { error } = await supabase.from("articles").update({
      title, excerpt, content, category, is_published, updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/articles");
    revalidatePath("/portal/articles");
    return { success: true, message: `Artikel "${title}" berhasil diperbarui.` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteArticle(id: string): Promise<ArticleActionState> {
  try {
    const supabase = await verifyAdminForArticles();
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/admin/articles");
    revalidatePath("/portal/articles");
    return { success: true, message: "Artikel berhasil dihapus." };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
