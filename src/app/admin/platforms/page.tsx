import { createClient } from "@/lib/supabase/server";
import { PlatformForm } from "./platform-form";

export default async function PlatformsPage() {
  const supabase = await createClient();
  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name, icon_url, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-green">Platform</span>
        </h1>
        <p className="text-sm text-text-secondary">Tambah dan kelola platform media sosial.</p>
      </div>

      <PlatformForm />

      {/* Data Table */}
      <div
        className="border border-border-default overflow-hidden"
        style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary border-b border-border-default">
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Nama</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Icon URL</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {(!platforms || platforms.length === 0) && (
                <tr><td colSpan={4} className="text-center py-10 text-text-tertiary text-sm">Belum ada platform.</td></tr>
              )}
              {(platforms || []).map((p) => (
                <tr key={p.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                  <td className="px-4 py-2.5 text-sm font-semibold text-text-primary">{p.name}</td>
                  <td className="px-4 py-2.5 text-xs text-text-tertiary font-mono truncate max-w-[200px]">{p.icon_url || "—"}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        p.status === "active" ? "bg-accent-green/10 text-accent-green" : "bg-bg-tertiary text-text-tertiary"
                      }`}
                      style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                    >
                      <span className={`w-1.5 h-1.5 ${p.status === "active" ? "bg-accent-green" : "bg-text-tertiary"}`} style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-tertiary">{new Date(p.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
