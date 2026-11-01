import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { DynamicPopUp } from "@/components/dynamic-popup";
import { isAdminRole } from "@/lib/admin-roles";
import { PortalShell } from "@/components/portal-shell";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAffiliate = profile?.role === "affiliate";
  const isAdmin = isAdminRole(profile?.role);

  const navLinks = [
    { labelKey: "portal.nav.home", href: "/portal" },
    { labelKey: "portal.nav.recovery", href: "/portal/troubleshoot" },
    { labelKey: "portal.nav.support", href: "/portal/support" },
    { labelKey: "portal.nav.articles", href: "/portal/articles" },
    { labelKey: "portal.nav.modules", href: "/portal/modules" },
    ...(isAffiliate ? [{ labelKey: "Affiliate", href: "/portal/affiliate" }] : []),
    ...(isAdmin ? [{ labelKey: "Admin", href: "/admin" }] : []),
  ];

  return (
    <PortalShell
      userEmail={user.email || ""}
      isAffiliate={isAffiliate}
      navLinks={navLinks}
      logoutAction={logout}
    >
      {children}
      <DynamicPopUp />
    </PortalShell>
  );
}
