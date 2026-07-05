import { createClient } from "@/lib/supabase/server";
import { IssueForm } from "./issue-form";

export default async function IssuesPage() {
  const supabase = await createClient();

  const [{ data: platforms }, { data: issues }] = await Promise.all([
    supabase.from("platforms").select("id, name").eq("status", "active").order("name"),
    supabase.from("issues").select("id, platform_id, issue_name, description, created_at, platforms(name)").order("created_at", { ascending: false }).limit(100),
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-gold">Kendala</span>
        </h1>
        <p className="text-sm text-text-secondary">Tambah dan kelola kendala per platform.</p>
      </div>

      <IssueForm platforms={platforms || []} />

      {/* Data Table */}
      <div
        className="border border-border-default overflow-hidden"
        style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary border-b border-border-default">
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Platform</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Nama Kendala</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Deskripsi</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {(!issues || issues.length === 0) && (
                <tr><td colSpan={4} className="text-center py-10 text-text-tertiary text-sm">Belum ada kendala.</td></tr>
              )}
              {(issues || []).map((issue: Record<string, unknown>) => (
                <tr key={issue.id as string} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-semibold text-accent-gold">{(issue.platforms as Record<string, string>)?.name || "—"}</span>
                  </td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-text-primary">{issue.issue_name as string}</td>
                  <td className="px-4 py-2.5 text-xs text-text-tertiary truncate max-w-[250px] hidden sm:table-cell">{(issue.description as string) || "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-text-tertiary">{new Date(issue.created_at as string).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
