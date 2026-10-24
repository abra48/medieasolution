import { createClient } from "@/lib/supabase/server";
import { PortalWelcome } from "./portal-welcome";
import { isAdminRole } from "@/lib/admin-roles";

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let hasAccess = false;
  if (user) {
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
  }

  return <PortalWelcome hasAccess={hasAccess} />;
}
