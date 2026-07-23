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
    <div className="space-y-8 animate-fade-in min-h-[80vh]">
      {/* Header */}
      <div className="relative">
        {/* Decorative background */}
        <div className="absolute inset-0 -m-4 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-accent/[0.03] blur-3xl portal-orb-1" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-secondary/[0.03] blur-3xl portal-orb-2" />
        </div>

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">Premium</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Pemulihan Akun</h1>
            <p className="text-sm text-text-tertiary mt-1.5 max-w-md">
              Pilih platform, identifikasi kendala, dan ikuti panduan solusi yang spesifik untuk setiap platform.
            </p>
          </div>

          {/* Decorative icon */}
          <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/5 border border-accent/10 portal-float">
            <svg className="w-7 h-7 text-accent/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Troubleshoot Flow */}
      <TroubleshootFlow platforms={platforms || []} />
    </div>
  );
}
