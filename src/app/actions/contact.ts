"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface ContactSettings {
  phone: string;
  website: string;
  whatsapp_url: string;
  telegram_url: string;
}

const CONTACT_ASSET_TITLE = "__contact_settings__";

/**
 * Fetch the current contact settings from the assets table.
 * Falls back to defaults if nothing is saved yet.
 */
export async function getContactSettings(): Promise<ContactSettings> {
  const defaults: ContactSettings = {
    phone: "081241511156",
    website: "mediea.co.id",
    whatsapp_url: "https://wa.me/6281241511156",
    telegram_url: "https://t.me/medieasolution",
  };

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("assets")
      .select("content")
      .eq("asset_type", "contact")
      .eq("title", CONTACT_ASSET_TITLE)
      .eq("is_active", true)
      .single();

    if (data?.content) {
      try {
        const parsed = JSON.parse(data.content);
        return {
          phone: parsed.phone || defaults.phone,
          website: parsed.website || defaults.website,
          whatsapp_url: parsed.whatsapp_url || defaults.whatsapp_url,
          telegram_url: parsed.telegram_url || defaults.telegram_url,
        };
      } catch {
        return defaults;
      }
    }
  } catch {
    // Table might not have a contact row yet
  }

  return defaults;
}

/**
 * Upsert contact settings into the assets table.
 */
export async function upsertContactSettings(
  _prevState: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string; message?: string }> {
  const phone = (formData.get("phone") as string)?.trim();
  const website = (formData.get("website") as string)?.trim();
  const whatsapp_url = (formData.get("whatsapp_url") as string)?.trim();
  const telegram_url = (formData.get("telegram_url") as string)?.trim();

  if (!phone) {
    return { error: "Nomor telepon wajib diisi." };
  }

  const supabase = await createClient();

  // Check if a contact settings row already exists
  const { data: existing } = await supabase
    .from("assets")
    .select("id")
    .eq("asset_type", "contact")
    .eq("title", CONTACT_ASSET_TITLE)
    .single();

  const contentJson = JSON.stringify({
    phone,
    website: website || "mediea.co.id",
    whatsapp_url: whatsapp_url || `https://wa.me/62${phone.replace(/^0/, "")}`,
    telegram_url: telegram_url || "https://t.me/medieasolution",
  });

  if (existing?.id) {
    // Update existing
    const { error } = await supabase
      .from("assets")
      .update({
        content: contentJson,
        description: `Phone: ${phone} | Web: ${website}`,
        is_active: true,
      })
      .eq("id", existing.id);

    if (error) {
      return { error: `Gagal menyimpan: ${error.message}` };
    }
  } else {
    // Insert new
    const { error } = await supabase.from("assets").insert({
      asset_type: "contact",
      title: CONTACT_ASSET_TITLE,
      description: `Phone: ${phone} | Web: ${website}`,
      content: contentJson,
      is_active: true,
    });

    if (error) {
      return { error: `Gagal menyimpan: ${error.message}` };
    }
  }

  revalidatePath("/admin/support");
  revalidatePath("/portal/support");
  revalidatePath("/");

  return { success: true, message: "Kontak berhasil diperbarui!" };
}
