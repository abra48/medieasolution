import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { isAdminRole, getNavPermissions, getAdminTierLabel, getAdminTierColor } from "@/lib/admin-roles";

export default async function AdminLayout({
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

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role;

  if (!isAdminRole(userRole)) {
    redirect("/portal");
  }

  const perms = getNavPermissions(userRole);
  const tierLabel = getAdminTierLabel(userRole);
  const tierColor = getAdminTierColor(userRole);

  const ALL_NAV_ITEMS = [
    {
      key: "dashboard" as const,
      label: "Dashboard",
      href: "/admin",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      key: "platforms" as const,
      label: "Manajemen Platform",
      href: "/admin/platforms",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: "issues" as const,
      label: "Manajemen Kendala",
      href: "/admin/issues",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      key: "solutions" as const,
      label: "Manajemen Panduan",
      href: "/admin/solutions",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      key: "codes" as const,
      label: "Kode Akses",
      href: "/admin/codes",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
    {
      key: "affiliates" as const,
      label: "Manajemen Affiliate",
      href: "/admin/affiliates",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      key: "assets" as const,
      label: "Aset Web",
      href: "/admin/assets",
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
  ];

  // Filter nav items based on role permissions
  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => perms[item.key]);

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* ══════ SIDEBAR ══════ */}
      <aside className="w-60 bg-bg-secondary border-r border-border-default flex-col shrink-0 hidden md:flex">
        {/* Header */}
        <div className="h-14 px-4 flex items-center border-b border-border-default">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center bg-accent-green/20 border border-accent-green/30"
              style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
            >
              <span className="text-accent-green text-xs font-bold">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-primary leading-tight">
                Mediea<span className="text-accent-green">Solution</span>
              </span>
              <span className="text-[9px] text-accent-gold font-semibold uppercase tracking-[0.15em]">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium
                         text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/60
                         transition-all duration-200"
              style={{
                clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)",
              }}
            >
              <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-transparent group-hover:bg-accent-green/40 transition-colors" />
              <span className="text-text-tertiary group-hover:text-accent-green transition-colors shrink-0">
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border-default">
          <div className="flex items-center gap-2.5 mb-2">
            <div
              className="w-7 h-7 flex items-center justify-center bg-accent-gold/15 text-accent-gold"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
              <span className="text-[10px] font-bold">{tierLabel.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-text-primary truncate">Admin</p>
                <span
                  className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-px bg-${tierColor}/10 text-${tierColor}`}
                  style={{ clipPath: "polygon(0 1px, 1px 0, 100% 0, 100% calc(100% - 1px), calc(100% - 1px) 100%, 0 100%)" }}
                >
                  {tierLabel}
                </span>
              </div>
              <p className="text-[10px] text-text-tertiary truncate">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-xs text-text-tertiary hover:text-danger px-2.5 py-1.5 hover:bg-bg-tertiary/60 transition-all flex items-center gap-2"
              style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* ══════ MAIN ══════ */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 px-4 flex items-center justify-between border-b border-border-default bg-bg-secondary">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-accent-green/20 border border-accent-green/30"
              style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
            >
              <span className="text-accent-green text-[10px] font-bold">M</span>
            </div>
            <span className="text-xs font-semibold text-text-primary">Admin Panel</span>
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs text-text-tertiary hover:text-danger">Logout</button>
          </form>
        </header>

        <div className="md:hidden overflow-x-auto border-b border-border-default bg-bg-secondary/50 px-2">
          <div className="flex gap-0">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[11px] font-medium text-text-tertiary hover:text-text-primary shrink-0 border-b-2 border-transparent hover:border-accent-green/30"
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
