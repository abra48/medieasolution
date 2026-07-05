"use client";

import { useState, useEffect, useActionState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createIssue, deleteIssue, type ActionResult } from "@/app/actions/admin";
import { getIssuesTable } from "@/lib/platform-tables";

type Platform = { id: string; name: string };
type Issue = { id: string; issue_name: string; description: string | null; status: string; created_at: string };

export function IssuesManager({ platforms }: { platforms: Platform[] }) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [state, action, pending] = useActionState<ActionResult, FormData>(createIssue, null);

  const fetchIssues = useCallback(async (platformName: string) => {
    setLoading(true);
    const supabase = createClient();
    const tableName = getIssuesTable(platformName);
    const { data } = await supabase
      .from(tableName)
      .select("id, issue_name, description, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    setIssues(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedPlatform) fetchIssues(selectedPlatform.name);
  }, [selectedPlatform, fetchIssues]);

  // Refetch setelah berhasil tambah
  useEffect(() => {
    if (state?.success && selectedPlatform) {
      fetchIssues(selectedPlatform.name);
    }
  }, [state, selectedPlatform, fetchIssues]);

  const handleDelete = async (id: string) => {
    if (!selectedPlatform) return;
    const result = await deleteIssue(selectedPlatform.name, id);
    if (result?.success) fetchIssues(selectedPlatform.name);
  };

  return (
    <div className="space-y-6">
      {/* Platform Selector */}
      <div
        className="bg-bg-secondary border border-border-default p-4"
        style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
      >
        <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">
          Pilih Platform Target
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlatform(p)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                selectedPlatform?.id === p.id
                  ? "bg-accent/15 text-accent border-accent/30"
                  : "bg-bg-tertiary/40 text-text-tertiary border-border-default hover:text-text-secondary"
              }`}
              style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area — gated by platform selection */}
      {!selectedPlatform && (
        <div className="card text-center !py-12">
          <p className="text-sm text-text-tertiary">Pilih platform terlebih dahulu untuk mengelola kendala.</p>
        </div>
      )}

      {selectedPlatform && (
        <>
          {/* Add Issue Form */}
          <div
            className="bg-bg-secondary border border-border-default"
            style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
          >
            <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
              <div
                className="w-7 h-7 flex items-center justify-center bg-accent-gold/15 text-accent-gold"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-primary">
                Tambah Kendala — <span className="text-accent">{selectedPlatform.name}</span>
              </h3>
            </div>

            <form action={action} className="p-5 space-y-4">
              <input type="hidden" name="platform_name" value={selectedPlatform.name} />

              {state?.error && (
                <div
                  className="px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-danger"
                  style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                >{state.error}</div>
              )}
              {state?.success && (
                <div
                  className="px-3 py-2 bg-accent-green/10 border border-accent-green/20 text-xs text-accent-green"
                  style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                >{state.message}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                    Nama Kendala *
                  </label>
                  <input
                    name="issue_name"
                    required
                    placeholder="Contoh: Akun Terblokir Permanen"
                    className="input !py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                    Deskripsi
                  </label>
                  <input
                    name="description"
                    placeholder="Deskripsi teknis singkat"
                    className="input !py-2 text-sm"
                  />
                </div>
              </div>

              <button type="submit" disabled={pending} className="btn-primary !py-2 text-sm disabled:opacity-50">
                {pending ? "Menyimpan..." : "Simpan Kendala"}
              </button>
            </form>
          </div>

          {/* Issues Data Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">
                Kendala Terdaftar — <span className="text-accent">{selectedPlatform.name}</span>
              </h2>
              <span className="text-xs text-text-tertiary">{issues.length} kendala</span>
            </div>

            <div
              className="border border-border-default overflow-hidden"
              style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-bg-secondary border-b border-border-default">
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Nama Kendala</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Deskripsi</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Dibuat</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {loading && (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-text-tertiary text-sm">Memuat data...</td>
                      </tr>
                    )}
                    {!loading && issues.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-text-tertiary text-sm">Belum ada kendala untuk platform ini.</td>
                      </tr>
                    )}
                    {!loading && issues.map((issue) => (
                      <tr key={issue.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                        <td className="px-4 py-2.5 text-sm font-semibold text-text-primary">{issue.issue_name}</td>
                        <td className="px-4 py-2.5 text-xs text-text-tertiary truncate max-w-[250px] hidden sm:table-cell">{issue.description || "—"}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              issue.status === "active" ? "bg-accent-green/10 text-accent-green" : "bg-bg-tertiary text-text-tertiary"
                            }`}
                            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                          >
                            <span
                              className={`w-1.5 h-1.5 ${issue.status === "active" ? "bg-accent-green" : "bg-text-tertiary"}`}
                              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                            />
                            {issue.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-text-tertiary">
                          {new Date(issue.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleDelete(issue.id)}
                            className="text-[10px] text-text-tertiary hover:text-danger transition-colors uppercase tracking-wider font-semibold"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
