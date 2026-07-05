import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = (body.code as string)?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Kode akses wajib diisi." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Anda belum login. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // 2. Check if user already has an active code
    const { data: existingCode } = await supabase
      .from("access_codes")
      .select("id")
      .eq("used_by", user.id)
      .eq("is_used", true)
      .single();

    if (existingCode) {
      return NextResponse.json({
        success: true,
        message: "Akses premium Anda sudah aktif.",
        alreadyActive: true,
      });
    }

    // 3. Look up the code
    const { data: accessCode, error: lookupError } = await supabase
      .from("access_codes")
      .select("id, code, is_used")
      .eq("code", code)
      .single();

    if (lookupError || !accessCode) {
      return NextResponse.json(
        { error: "Kode akses tidak valid. Periksa kembali kode Anda." },
        { status: 404 }
      );
    }

    if (accessCode.is_used) {
      return NextResponse.json(
        {
          error:
            "Kode akses sudah digunakan. Setiap kode hanya berlaku 1x pakai.",
        },
        { status: 409 }
      );
    }

    // 4. Redeem the code
    const { error: updateError } = await supabase
      .from("access_codes")
      .update({ is_used: true, used_by: user.id })
      .eq("id", accessCode.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Gagal mengaktifkan kode: " + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kode akses berhasil diaktifkan!",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan server. " +
          (err instanceof Error ? err.message : ""),
      },
      { status: 500 }
    );
  }
}
