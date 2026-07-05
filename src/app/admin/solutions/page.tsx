import { createClient } from "@/lib/supabase/server";
import { SolutionBuilder } from "./solution-builder";

export default async function SolutionsPage() {
  const supabase = await createClient();

  const [{ data: platforms }, { data: solutions }] = await Promise.all([
    supabase.from("platforms").select("id, name").eq("status", "active").order("name"),
    supabase.from("solutions")
      .select("id, issue_id, step_number, content_type, content_data, shortcut_url, method_group, created_at, issues(issue_name, platforms(name))")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  // Fetch issues for each platform
  const { data: issues } = await supabase
    .from("issues")
    .select("id, platform_id, issue_name")
    .order("issue_name");

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-green">Panduan</span>
        </h1>
        <p className="text-sm text-text-secondary">Bangun langkah-langkah solusi untuk setiap kendala.</p>
      </div>

      <SolutionBuilder platforms={platforms || []} issues={issues || []} />

      {/* Data Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Panduan Terdaftar</h2>
          <span className="text-xs text-text-tertiary">{solutions?.length ?? 0} langkah</span>
        </div>
        <div
          className="border border-border-default overflow-hidden"
          style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-bg-secondary border-b border-border-default">
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Platform</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Kendala</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Metode</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Langkah</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Tipe</th>
                  <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Konten</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {(!solutions || solutions.length === 0) && (
                  <tr><td colSpan={6} className="text-center py-10 text-text-tertiary text-sm">Belum ada panduan.</td></tr>
                )}
                {(solutions || []).map((s: Record<string, unknown>) => {
                  const issueData = s.issues as Record<string, unknown> | null;
                  const platformData = issueData?.platforms as Record<string, string> | null;
                  return (
                    <tr key={s.id as string} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                      <td className="px-4 py-2.5 text-xs font-semibold text-accent-gold">{platformData?.name || "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-text-primary font-medium">{(issueData?.issue_name as string) || "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] font-semibold text-accent-green/80 bg-accent-green/10 px-1.5 py-0.5"
                          style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}>
                          {(s.method_group as string) || "Cara 1"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-bold text-text-tertiary bg-bg-secondary border border-border-default"
                          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                          {s.step_number as number}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">{s.content_type as string}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-text-tertiary truncate max-w-[200px] hidden md:table-cell">{(s.content_data as string)?.substring(0, 60)}...</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
