import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { isAdminRole, getNavPermissions, getAdminTierLabel } from "@/lib/admin-roles";

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
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <aside className="w-56 bg-bg-secondary border-r border-border-default flex-col shrink-0 hidden md:flex">
        <div className="h-14 px-4 flex items-center border-b border-border-default">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="https://i.ibb.co.com/qY3R33DK/Gemini-Generated-Image-xmtysbxmtysbxmty.png" alt="Mediea Solution" className="w-6 h-6 rounded-md object-cover" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-primary leading-tight">
                Mediea<span className="text-accent">Solution</span>
              </span>
              <span className="text-[9px] text-text-tertiary uppercase tracking-widest">Admin</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-xs font-medium text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border-default">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-secondary/10 flex items-center justify-center">
              <span className="text-secondary text-[9px] font-bold">{tierLabel.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-text-primary truncate">{user.email}</p>
              <p className="text-[9px] text-text-tertiary uppercase tracking-wider">{tierLabel}</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-[10px] text-text-tertiary hover:text-danger px-2 py-1.5 hover:bg-bg-tertiary rounded-md transition-colors text-left"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden h-12 px-4 flex items-center justify-between border-b border-border-default bg-bg-secondary">
          <Link href="/admin" className="text-xs font-semibold text-text-primary">Admin</Link>
          <form action={logout}>
            <button type="submit" className="text-xs text-text-tertiary hover:text-danger">Sign out</button>
          </form>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden overflow-x-auto border-b border-border-default bg-bg-secondary/50 px-2">
          <div className="flex gap-0">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[11px] font-medium text-text-tertiary hover:text-text-primary shrink-0"
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
