import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { isAdminRole, getNavPermissions, getAdminTierLabel } from "@/lib/admin-roles";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
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

  const userRole = profile?.role;
  if (!isAdminRole(userRole)) redirect("/portal");

  const perms = getNavPermissions(userRole);
  const tierLabel = getAdminTierLabel(userRole);

  const ALL_NAV_ITEMS = [
    { key: "dashboard" as const, label: "Dashboard", href: "/admin" },
    { key: "platforms" as const, label: "Platforms", href: "/admin/platforms" },
    { key: "issues" as const, label: "Issues", href: "/admin/issues" },
    { key: "solutions" as const, label: "Solutions", href: "/admin/solutions" },
    { key: "codes" as const, label: "Access Codes", href: "/admin/codes" },
    { key: "affiliates" as const, label: "Affiliates", href: "/admin/affiliates" },
    { key: "assets" as const, label: "Assets", href: "/admin/assets" },
    { key: "articles" as const, label: "Articles", href: "/admin/articles" },
    { key: "modules" as const, label: "Modules", href: "/admin/modules" },
    { key: "support" as const, label: "Support", href: "/admin/support" },
  ];

  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => perms[item.key]);

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a', color: '#e8e6e1' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-col shrink-0 hidden md:flex" style={{ background: '#0e0e0e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="h-14 px-4 flex items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/admin" className="flex items-center gap-0" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '-0.02em' }}>
            <span className="text-xs" style={{ color: '#e8e6e1' }}>mediea</span>
            <span className="text-xs" style={{ color: '#7a7a72' }}>/</span>
            <span className="text-xs italic" style={{ color: '#c5c3b8' }}>solution</span>
            <span className="text-[9px] uppercase tracking-widest ml-2" style={{ color: '#4a4a44' }}>Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-xs font-medium rounded-md transition-colors"
              style={{ color: '#7a7a72', letterSpacing: '0.03em' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span className="text-[9px] font-bold" style={{ color: '#c5c3b8' }}>{tierLabel.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium truncate" style={{ color: '#e8e6e1' }}>{user.email}</p>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: '#4a4a44' }}>{tierLabel}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-[10px] px-2 py-1.5 rounded-md transition-colors text-left"
              style={{ color: '#7a7a72', letterSpacing: '0.05em', textTransform: 'uppercase' }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden h-12 px-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0e0e0e' }}>
          <Link href="/admin" className="text-xs font-medium" style={{ color: '#e8e6e1', fontFamily: 'Georgia, "Times New Roman", serif' }}>
            mediea<span style={{ color: '#7a7a72' }}>/</span><em style={{ color: '#c5c3b8' }}>solution</em>
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs" style={{ color: '#7a7a72', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>Sign out</button>
          </form>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden overflow-x-auto px-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(14,14,14,0.5)' }}>
          <div className="flex gap-0">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[11px] font-medium shrink-0"
                style={{ color: '#7a7a72', letterSpacing: '0.05em', textTransform: 'uppercase' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
