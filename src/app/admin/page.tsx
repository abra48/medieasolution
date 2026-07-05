import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: totalUsers },
    { count: totalCodes },
    { count: usedCodes },
    { count: totalPlatforms },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("access_codes").select("*", { count: "exact", head: true }),
    supabase
      .from("access_codes")
      .select("*", { count: "exact", head: true })
      .eq("is_used", true),
    supabase
      .from("platforms")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "accent-green",
    },
    {
      label: "Total Codes",
      value: totalCodes ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      color: "accent-gold",
    },
    {
      label: "Used Codes",
      value: usedCodes ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "success",
    },
    {
      label: "Active Platforms",
      value: totalPlatforms ?? 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "info",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Admin <span className="text-gradient-gold">Dashboard</span>
        </h1>
        <p className="text-text-secondary">
          Overview of Mediea Solution platform statistics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card !p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-${stat.color}/15 flex items-center justify-center text-${stat.color}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-text-tertiary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/codes"
            className="card !p-5 flex items-center gap-4 group hover:!border-accent-green"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-green/15 flex items-center justify-center text-accent-green">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary group-hover:text-accent-green transition-colors">
                Generate Access Codes
              </p>
              <p className="text-sm text-text-secondary">
                Create new codes for users
              </p>
            </div>
            <svg
              className="w-5 h-5 text-text-tertiary ml-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <Link
            href="/admin/codes"
            className="card !p-5 flex items-center gap-4 group hover:!border-accent-gold"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text-primary group-hover:text-accent-gold transition-colors">
                View All Codes
              </p>
              <p className="text-sm text-text-secondary">
                Monitor code usage and status
              </p>
            </div>
            <svg
              className="w-5 h-5 text-text-tertiary ml-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
