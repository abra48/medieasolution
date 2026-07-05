import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { DynamicPopUp } from "@/components/dynamic-popup";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check user role for conditional nav items
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAffiliate = profile?.role === "affiliate";

  const NAV_LINKS = [
    { label: "Portal", href: "/portal" },
    { label: "Hubungi Agen", href: "/portal/support" },
    { label: "Pusat Informasi", href: "/portal/articles" },
    { label: "Modul Belajar", href: "/portal/modules" },
    ...(isAffiliate ? [{ label: "Affiliate", href: "/portal/affiliate" }] : []),
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Portal Navigation */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Row */}
          <div className="h-16 flex items-center justify-between">
            <Link href="/portal" className="flex items-center gap-3 shrink-0">
              <div
                className="w-8 h-8 flex items-center justify-center bg-accent-green/20 border border-accent-green/30"
                style={{
                  clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
                }}
              >
                <span className="text-accent-green text-sm font-bold">M</span>
              </div>
              <span className="font-semibold text-text-primary tracking-tight hidden sm:inline">
                Mediea<span className="text-accent-green">Solution</span>
              </span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-text-secondary hidden md:block truncate max-w-[180px]">
                {user.email}
              </span>
              {isAffiliate && (
                <span
                  className="text-[9px] font-bold text-accent-gold uppercase tracking-wider px-2 py-0.5 bg-accent-gold/10 border border-accent-gold/20 hidden sm:inline-flex"
                  style={{
                    clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)",
                  }}
                >
                  Affiliate
                </span>
              )}
              <form action={logout}>
                <button
                  type="submit"
                  className="text-xs sm:text-sm text-text-tertiary hover:text-danger transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Row — Navigation Tabs */}
          <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-none">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2.5 text-xs font-semibold text-text-tertiary
                           hover:text-text-primary transition-colors shrink-0
                           border-b-2 border-transparent hover:border-accent-green/30"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>

      {/* Dynamic Pop-Up */}
      <DynamicPopUp />
    </div>
  );
}
