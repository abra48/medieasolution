import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/admin-roles";
import { TroubleshootFlow } from "@/components/troubleshoot/troubleshoot-flow";

export default async function TroubleshootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check access
  let hasAccess = false;
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (isAdminRole(profile?.role)) {
    hasAccess = true;
  } else {
    const { data: activeCode } = await supabase
      .from("access_codes")
      .select("id")
      .eq("used_by", user.id)
      .eq("is_used", true)
      .single();
    hasAccess = !!activeCode;
  }

  // If no access, redirect back to portal welcome page
  if (!hasAccess) {
    redirect("/portal");
  }

  // Fetch platforms
  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name, icon_url, status")
    .eq("status", "active")
    .order("name");

  return (
    <div className="max-w-3xl mx-auto py-4 min-h-[80vh]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Pemulihan Akun</h1>
        <p className="text-sm text-text-tertiary mt-1">
          Pilih platform, identifikasi kendala, dan ikuti panduan solusi.
        </p>
      </div>

      {/* Troubleshoot Flow */}
      <TroubleshootFlow platforms={platforms || []} />
    </div>
  );
}
