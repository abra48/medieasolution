import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/admin-roles";
import { TroubleshootFlow } from "@/components/troubleshoot/troubleshoot-flow";
import { TroubleshootHeader } from "@/components/troubleshoot/troubleshoot-header";

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

  if (!hasAccess) {
    redirect("/portal");
  }

  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name, icon_url, status")
    .eq("status", "active")
    .order("name");

  return (
    <div className="max-w-3xl mx-auto py-4 min-h-[80vh]">
      <TroubleshootHeader />
      <TroubleshootFlow platforms={platforms || []} />
    </div>
  );
}
