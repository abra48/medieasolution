import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";

// Simple in-memory rate limiter (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // max attempts
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Coba lagi dalam 1 menit." },
        { status: 429 }
      );
    }

    // Validate content type
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type harus application/json." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const code = (body.code as string)?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Kode akses wajib diisi." },
        { status: 400 }
      );
    }

    // Validate code format (alphanumeric, reasonable length)
    if (code.length > 30 || !/^[A-Z0-9_-]+$/.test(code)) {
      return NextResponse.json(
        { error: "Format kode tidak valid." },
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

    // Use admin client (bypasses RLS) for access_codes operations
    const adminClient = createAdminClient();

    // 2. Check if user already has an active code
    const { data: existingCode } = await adminClient
      .from("access_codes")
      .select("id")
      .eq("used_by", user.id)
      .eq("is_used", true)
      .limit(1)
      .maybeSingle();

    if (existingCode) {
      return NextResponse.json({
        success: true,
        message: "Akses premium Anda sudah aktif.",
        alreadyActive: true,
      });
    }

    // 3. Look up the code
    const { data: accessCode, error: lookupError } = await adminClient
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

    // 4. Redeem the code — admin client bypasses RLS
    const { data: redeemed, error: updateError } = await adminClient
      .from("access_codes")
      .update({ is_used: true, used_by: user.id, used_at: new Date().toISOString() })
      .eq("id", accessCode.id)
      .eq("is_used", false) // Extra safety
      .select("id");

    if (!updateError && (!redeemed || redeemed.length === 0)) {
      return NextResponse.json(
        { error: "Kode akses sudah digunakan. Setiap kode hanya berlaku 1x pakai." },
        { status: 409 }
      );
    }

    if (updateError) {
      console.error("Failed to redeem code:", updateError);
      return NextResponse.json(
        { error: "Gagal mengaktifkan kode. Coba lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kode akses berhasil diaktifkan!",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
