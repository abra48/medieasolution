import { createClient } from "@/lib/supabase/server";
import { hasPremiumAccess } from "@/lib/access";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return NextResponse.json({
      authenticated: !!user,
      hasAccess: user ? await hasPremiumAccess(supabase, user.id) : false,
    });
  } catch {
    return NextResponse.json({ authenticated: false, hasAccess: false });
  }
}
