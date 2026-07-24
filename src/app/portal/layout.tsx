import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { DynamicPopUp } from "@/components/dynamic-popup";
import { isAdminRole } from "@/lib/admin-roles";

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

  const NAV_LINKS = [
    { label: "Beranda", href: "/portal" },
    { label: "Pemulihan", href: "/portal/troubleshoot" },
    { label: "Dukungan", href: "/portal/support" },
    { label: "Artikel", href: "/portal/articles" },
    { label: "Modul", href: "/portal/modules" },
    ...(isAffiliate ? [{ label: "Affiliate", href: "/portal/affiliate" }] : []),
    ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          {/* Top bar */}
          <div className="h-12 sm:h-14 flex items-center justify-between gap-2">
            <Link href="/portal" className="flex items-center gap-2 shrink-0">
              <img src="https://i.ibb.co.com/qY3R33DK/Gemini-Generated-Image-xmtysbxmtysbxmty.png" alt="Mediea Solution" className="w-7 h-7 rounded-md object-cover flex-shrink-0" />
              <span className="font-semibold text-sm text-text-primary hidden sm:inline">
                Mediea<span className="text-accent">Solution</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-text-tertiary hidden md:block truncate max-w-[160px]">
                {user.email}
              </span>
              {isAffiliate && (
                <span className="text-[9px] font-semibold text-secondary uppercase tracking-wider px-2 py-0.5 bg-secondary/10 border border-secondary/20 rounded hidden sm:inline-flex">
                  Affiliate
                </span>
              )}
              <form action={logout}>
                <button type="submit" className="text-xs text-text-tertiary hover:text-danger transition-colors whitespace-nowrap">
                  Sign out
                </button>
              </form>
            </div>
          </div>

          {/* Nav tabs — horizontal scroll on mobile */}
          <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors shrink-0 border-b-2 border-transparent hover:border-accent/30 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">{children}</main>
      <DynamicPopUp />
    </div>
  );
}
