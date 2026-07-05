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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[9px] font-semibold text-accent uppercase tracking-wider">Premium</span>
            </div>
          </div>
          <h1 className="text-xl font-bold text-text-primary">Pemulihan Akun</h1>
          <p className="text-sm text-text-tertiary mt-0.5">
            Pilih platform, identifikasi kendala, dan ikuti panduan solusi.
          </p>
        </div>
      </div>

      {/* Troubleshoot Flow */}
      <TroubleshootFlow platforms={platforms || []} />
    </div>
  );
}
