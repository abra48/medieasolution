import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalCodes },
    { count: usedCodes },
    { count: totalPlatforms },
    { count: totalArticles },
    { count: totalModules },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("access_codes").select("*", { count: "exact", head: true }),
    supabase.from("access_codes").select("*", { count: "exact", head: true }).eq("is_used", true),
    supabase.from("platforms").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("modules").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Users", value: totalUsers ?? 0 },
    { label: "Total Codes", value: totalCodes ?? 0 },
    { label: "Used Codes", value: usedCodes ?? 0 },
    { label: "Active Platforms", value: totalPlatforms ?? 0 },
    { label: "Articles", value: totalArticles ?? 0 },
    { label: "Modules", value: totalModules ?? 0 },
  ];

  const quickActions = [
    { label: "Generate Codes", desc: "Create new access codes", href: "/admin/codes" },
    { label: "Manage Platforms", desc: "Add or edit platforms", href: "/admin/platforms" },
    { label: "Manage Articles", desc: "Create & edit articles", href: "/admin/articles" },
    { label: "Manage Modules", desc: "Create & edit learning modules", href: "/admin/modules" },
    { label: "Manage Support", desc: "FAQ & contact content", href: "/admin/support" },
    { label: "Manage Assets", desc: "Banners, pop-ups, testimonials", href: "/admin/assets" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Dashboard</h1>
        <p className="text-sm text-text-tertiary">Platform overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card !p-4">
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="card !p-4 flex items-center justify-between group">
              <div>
                <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{action.label}</p>
                <p className="text-xs text-text-tertiary">{action.desc}</p>
              </div>
              <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
