"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdminLead } from "@/lib/admin-roles";

export type AccessCodeState = {
  success?: boolean;
  error?: string;
  message?: string;
} | null;

export async function redeemAccessCode(
  _prevState: AccessCodeState,
  formData: FormData
): Promise<AccessCodeState> {
  const supabase = await createClient();

  const code = (formData.get("code") as string)?.trim().toUpperCase();

  if (!code) {
    return { error: "Kode akses wajib diisi." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Autentikasi diperlukan. Silakan login terlebih dahulu." };
  }

  // Check if user already has an active code
  const { data: existingCode } = await supabase
    .from("access_codes")
    .select("id")
    .eq("used_by", user.id)
    .eq("is_used", true)
    .single();

  if (existingCode) {
    return { success: true, message: "Akses premium Anda sudah aktif." };
  }

  // Look up the code
  const { data: accessCode, error: lookupError } = await supabase
    .from("access_codes")
    .select("id, code, is_used")
    .eq("code", code)
    .single();

  if (lookupError || !accessCode) {
    return { error: "Kode akses tidak valid. Periksa kembali dan coba lagi." };
  }

  if (accessCode.is_used) {
    return { error: "Kode akses sudah digunakan. Setiap kode hanya berlaku 1x pakai." };
  }

  // Redeem the code
  const { error: updateError } = await supabase
    .from("access_codes")
    .update({
      is_used: true,
      used_by: user.id,
    })
    .eq("id", accessCode.id);

  if (updateError) {
    return { error: "Gagal mengaktifkan kode. Silakan coba lagi." };
  }

  return { success: true, message: "Kode akses berhasil diaktifkan. Panduan premium telah dibuka." };
}

function generateRandomCode(length: number = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

export type GenerateCodesState = {
  success?: boolean;
  error?: string;
  codes?: string[];
  count?: number;
} | null;

export async function generateAccessCodes(
  _prevState: GenerateCodesState,
  formData: FormData
): Promise<GenerateCodesState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Autentikasi diperlukan." };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  // Hanya admin/admin_lead yang bisa generate kode
  if (!isAdminLead(profile?.role)) {
    return { error: "Akses ditolak. Hak akses Lead diperlukan untuk generate kode." };
  }

  const quantity = parseInt(formData.get("quantity") as string, 10);

  if (!quantity || quantity < 1 || quantity > 100) {
    return { error: "Jumlah harus antara 1 hingga 100." };
  }

  // Generate unique codes
  const codes: string[] = [];
  const maxAttempts = quantity * 3;
  let attempts = 0;

  while (codes.length < quantity && attempts < maxAttempts) {
    const code = generateRandomCode(12);
    if (!codes.includes(code)) {
      codes.push(code);
    }
    attempts++;
  }

  // Bulk insert
  const { error: insertError } = await supabase.from("access_codes").insert(
    codes.map((code) => ({
      code,
      is_used: false,
    }))
  );

  if (insertError) {
    if (insertError.code === "23505") {
      return { error: "Kode duplikat terdeteksi. Silakan coba lagi." };
    }
    return { error: `Gagal generate kode: ${insertError.message}` };
  }

  return {
    success: true,
    codes,
    count: codes.length,
  };
}
