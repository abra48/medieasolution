import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { DynamicPopUp } from "@/components/dynamic-popup";
import { isAdminRole } from "@/lib/admin-roles";
import { PortalToolbar } from "@/components/portal-toolbar";

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
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e8e6e1' }}>
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {/* Top bar */}
          <div className="h-14 flex items-center justify-between gap-3">
            <Link href="/portal" className="flex items-center gap-0 shrink-0" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '-0.02em' }}>
              <span className="text-sm" style={{ color: '#e8e6e1' }}>mediea</span>
              <span className="text-sm" style={{ color: '#7a7a72' }}>/</span>
              <span className="text-sm italic" style={{ color: '#c5c3b8' }}>solution</span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs hidden md:block truncate max-w-[160px]" style={{ color: '#7a7a72' }}>
                {user.email}
              </span>
              {isAffiliate && (
                <span className="text-[9px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full hidden sm:inline-flex" style={{ color: '#c5c3b8', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Affiliate
                </span>
              )}
              <PortalToolbar />
              <form action={logout}>
                <button type="submit" className="text-xs transition-colors whitespace-nowrap" style={{ color: '#7a7a72', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>
                  Sign out
                </button>
              </form>
            </div>
          </div>

          {/* Nav tabs — horizontal scroll on mobile */}
          <div className="flex gap-0 -mb-px overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 text-[11px] font-medium transition-colors shrink-0 whitespace-nowrap"
                style={{ color: '#7a7a72', letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '24px' }}
              >
                <span style={{ color: '#4a4a44', marginRight: '6px', fontSize: '9px' }}>0{i + 1}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="portal-page-enter">{children}</div>
      </main>
      <DynamicPopUp />
    </div>
  );
}
