"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/admin-roles";

export type AuthState = {
  error?: string;
  message?: string;
} | null;

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Autentikasi gagal. Periksa kredensial Anda." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Gagal memverifikasi sesi. Coba lagi." };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (isAdminRole(profile?.role)) {
    redirect("/admin");
  } else {
    redirect("/portal");
  }
}

export async function register(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  if (password !== confirmPassword) {
    return { error: "Password tidak cocok. Periksa kembali." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: "Registrasi gagal. " + error.message };
  }

  if (data.user) {
    // Insert into users table with default 'user' role
    // Use upsert to avoid conflict with on_auth_user_created trigger
    const { error: profileError } = await supabase.from("users").upsert(
      { id: data.user.id, role: "user" },
      { onConflict: "id", ignoreDuplicates: true }
    );
    if (profileError) {
      console.error("Failed to create user profile:", profileError.message);
    }
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    return {
      message: "Periksa email Anda untuk konfirmasi registrasi.",
    };
  }

  redirect("/portal");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
