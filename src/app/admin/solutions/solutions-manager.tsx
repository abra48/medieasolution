"use client";

import { useState, useEffect, useCallback, useActionState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { createSolution, deleteSolution, type ActionResult } from "@/app/actions/admin";
import { getIssuesTable, getSolutionsTable } from "@/lib/platform-tables";

type Platform = { id: string; name: string };
type Issue = { id: string; issue_name: string };
type SolutionRow = {
  id: string;
  issue_id: string;
  step_number: number;
  content_type: string;
  content_data: string;
  method_group: string;
  button_label: string | null;
  button_link: string | null;
  created_at: string;
};

const CONTENT_TYPES = [
  { value: "text", label: "Teks / Panduan", icon: "¶" },
  { value: "video", label: "Video", icon: "▶" },
  { value: "template", label: "Template / Bahan", icon: "⎘" },
  { value: "link", label: "Link", icon: "⛓" },
];

export function SolutionsManager({ platforms }: { platforms: Platform[] }) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState("text");
  const [state, action, pending] = useActionState<ActionResult, FormData>(createSolution, null);

  const fetchData = useCallback(async (platformName: string) => {
    setLoading(true);
    const supabase = createClient();
    const issuesTable = getIssuesTable(platformName);
    const solutionsTable = getSolutionsTable(platformName);

    const [{ data: issuesData }, { data: solutionsData }] = await Promise.all([
      supabase.from(issuesTable).select("id, issue_name").order("issue_name"),
      supabase
        .from(solutionsTable)
        .select("id, issue_id, step_number, content_type, content_data, method_group, button_label, button_link, created_at")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    setIssues(issuesData || []);
    setSolutions(solutionsData || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedPlatform) fetchData(selectedPlatform.name);
  }, [selectedPlatform, fetchData]);

  // Refetch setelah berhasil tambah
  useEffect(() => {
    if (state?.success && selectedPlatform) {
      fetchData(selectedPlatform.name);
    }
  }, [state, selectedPlatform, fetchData]);

  const handleDelete = async (id: string) => {
    if (!selectedPlatform) return;
    const result = await deleteSolution(selectedPlatform.name, id);
    if (result?.success) fetchData(selectedPlatform.name);
  };

  // Map issue_id → issue_name for display
  const issueMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of issues) m.set(i.id, i.issue_name);
    return m;
  }, [issues]);

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
                  ? "bg-accent-green/15 text-accent-green border-accent-green/30"
                  : "bg-bg-tertiary/40 text-text-tertiary border-border-default hover:text-text-secondary"
              }`}
              style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!selectedPlatform && (
        <div className="card text-center !py-12">
          <p className="text-sm text-text-tertiary">Pilih platform terlebih dahulu untuk mengelola panduan.</p>
        </div>
      )}

      {selectedPlatform && (
        <>
          {/* Solution Builder Form */}
          <div
            className="bg-bg-secondary border border-border-default"
            style={{ clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
              <div
                className="w-7 h-7 flex items-center justify-center bg-accent-green/15 text-accent-green"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  Solution Builder — <span className="text-accent-green">{selectedPlatform.name}</span>
                </h3>
                <p className="text-[10px] text-text-tertiary">Bangun langkah solusi untuk kendala tertentu</p>
              </div>
            </div>

            <form action={action} className="p-5 space-y-5">
              <input type="hidden" name="platform_name" value={selectedPlatform.name} />

              {/* Feedback */}
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

              {/* Row 1: Issue selector */}
              <div>
                <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                  Pilih Kendala *
                </label>
                <select name="issue_id" required className="input !py-2 text-sm">
                  <option value="">
                    {issues.length === 0
                      ? "— Tidak ada kendala terdaftar —"
                      : "— Pilih Kendala —"}
                  </option>
                  {issues.map((issue) => (
                    <option key={issue.id} value={issue.id}>{issue.issue_name}</option>
                  ))}
                </select>
              </div>

              {/* Row 2: Step config */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                    Nomor Langkah *
                  </label>
                  <input
                    name="step_number"
                    type="number"
                    min={1}
                    max={50}
                    defaultValue={1}
                    required
                    className="input !py-2 text-sm text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                    Metode Grup
                  </label>
                  <input
                    name="method_group"
                    defaultValue="Cara 1"
                    placeholder="Contoh: Cara 1, Cara 2"
                    className="input !py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                    Tipe Konten *
                  </label>
                  <select
                    name="content_type"
                    required
                    value={selectedContentType}
                    onChange={(e) => setSelectedContentType(e.target.value)}
                    className="input !py-2 text-sm"
                  >
                    {CONTENT_TYPES.map((ct) => (
                      <option key={ct.value} value={ct.value}>{ct.icon} {ct.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content Type Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {CONTENT_TYPES.map((ct) => (
                    <button
                      key={ct.value}
                      type="button"
                      onClick={() => setSelectedContentType(ct.value)}
                      className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200
                        ${selectedContentType === ct.value
                          ? "bg-accent-green/15 text-accent-green border-accent-green/30"
                          : "bg-bg-tertiary/40 text-text-tertiary border-border-default hover:text-text-secondary"
                        } border`}
                      style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                    >
                      {ct.icon} {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Dynamic content fields */}
              <div
                className="bg-bg-primary/50 border border-border-default p-4 space-y-4"
                style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
              >
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <span
                    className="px-1.5 py-0.5 bg-accent-green/10 text-accent-green font-semibold uppercase tracking-wider text-[9px]"
                    style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                  >
                    {CONTENT_TYPES.find((ct) => ct.value === selectedContentType)?.label}
                  </span>
                  <span>— Masukkan konten di bawah</span>
                </div>

                {/* TEXT content */}
                {selectedContentType === "text" && (
                  <div>
                    <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                      Panduan Teks *
                    </label>
                    <textarea
                      name="content_data"
                      required
                      rows={6}
                      placeholder={"1. Buka aplikasi [Platform]\n2. Klik menu Settings\n3. Pilih opsi Account Recovery\n4. Ikuti instruksi selanjutnya..."}
                      className="input !py-2.5 text-sm resize-y min-h-[120px] font-mono"
                    />
                    <p className="text-[10px] text-text-tertiary mt-1">
                      Gunakan format bernomor. Teks **bold** akan ditampilkan tebal di sisi pengguna.
                    </p>
                  </div>
                )}

                {/* VIDEO content */}
                {selectedContentType === "video" && (
                  <div>
                    <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                      URL Video *
                    </label>
                    <input
                      name="content_data"
                      required
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="input !py-2 text-sm font-mono"
                    />
                    <p className="text-[10px] text-text-tertiary mt-1">
                      Mendukung YouTube, Vimeo, dan URL embed lainnya.
                    </p>
                  </div>
                )}

                {/* TEMPLATE content */}
                {selectedContentType === "template" && (
                  <div>
                    <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                      Template / Copywriting *
                    </label>
                    <textarea
                      name="content_data"
                      required
                      rows={8}
                      placeholder={"Kepada Tim Support [Platform],\n\nSaya pemilik akun [username] yang mengalami kendala [masalah].\nBerikut data verifikasi identitas saya:\n- Nama Lengkap: ...\n- Email Terdaftar: ...\n- Nomor Telepon: ...\n\nMohon bantuan untuk memulihkan akses akun saya.\n\nTerima kasih."}
                      className="input !py-2.5 text-sm resize-y min-h-[160px] font-mono"
                    />
                    <p className="text-[10px] text-text-tertiary mt-1">
                      Pengguna akan dapat menyalin template ini secara langsung dari area &quot;Copy to Clipboard&quot;.
                    </p>
                  </div>
                )}

                {/* LINK content */}
                {selectedContentType === "link" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                        Instruksi *
                      </label>
                      <textarea
                        name="content_data"
                        required
                        rows={4}
                        placeholder={"Klik tombol di bawah untuk membuka halaman pemulihan akun resmi dari [Platform]."}
                        className="input !py-2.5 text-sm resize-y min-h-[80px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Button Fields — up to 3 buttons */}
              <div
                className="bg-accent-gold/5 border border-accent-gold/20 p-4 space-y-4"
                style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-xs font-semibold text-accent-gold">Dynamic Action Buttons (up to 3)</span>
                </div>
                <p className="text-[10px] text-text-tertiary">
                  Add up to 3 shortcut buttons with cute icons. Each button needs both a label and a URL. Leave empty if not needed.
                </p>

                {/* Button 1 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">Button 1 — 🚀 Rocket</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                        Button Label 1
                      </label>
                      <input
                        name="button_label_1"
                        type="text"
                        placeholder="e.g. Open Recovery Form"
                        className="input !py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                        Button URL 1
                      </label>
                      <input
                        name="button_link_1"
                        type="url"
                        placeholder="https://help.platform.com/recovery"
                        className="input !py-2 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Button 2 */}
                <div className="space-y-2 border-t border-accent-gold/10 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Button 2 — ✨ Sparkles (optional)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                        Button Label 2
                      </label>
                      <input
                        name="button_label_2"
                        type="text"
                        placeholder="e.g. Download Template"
                        className="input !py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                        Button URL 2
                      </label>
                      <input
                        name="button_link_2"
                        type="url"
                        placeholder="https://..."
                        className="input !py-2 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Button 3 */}
                <div className="space-y-2 border-t border-accent-gold/10 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">Button 3 — 💖 Heart (optional)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                        Button Label 3
                      </label>
                      <input
                        name="button_label_3"
                        type="text"
                        placeholder="e.g. Watch Tutorial"
                        className="input !py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                        Button URL 3
                      </label>
                      <input
                        name="button_link_3"
                        type="url"
                        placeholder="https://..."
                        className="input !py-2 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-text-tertiary">
                  * Kolom wajib diisi
                </p>
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-primary !py-2.5 !px-8 text-sm disabled:opacity-50"
                >
                  {pending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                    "Simpan Langkah"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Solutions Data Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary">
                Panduan Terdaftar — <span className="text-accent-green">{selectedPlatform.name}</span>
              </h2>
              <span className="text-xs text-text-tertiary">{solutions.length} langkah</span>
            </div>

            <div
              className="border border-border-default overflow-hidden"
              style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-bg-secondary border-b border-border-default">
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Kendala</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Metode</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Langkah</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Tipe</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Nama Tombol</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden lg:table-cell">Konten</th>
                      <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {loading && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-text-tertiary text-sm">Memuat data...</td>
                      </tr>
                    )}
                    {!loading && solutions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-text-tertiary text-sm">Belum ada panduan untuk platform ini.</td>
                      </tr>
                    )}
                    {!loading && solutions.map((s) => (
                      <tr key={s.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                        <td className="px-4 py-2.5 text-xs text-text-primary font-medium">
                          {issueMap.get(s.issue_id) || "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="text-[10px] font-semibold text-accent-green/80 bg-accent-green/10 px-1.5 py-0.5"
                            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                          >
                            {s.method_group || "Cara 1"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="w-6 h-6 inline-flex items-center justify-center text-[10px] font-bold text-text-tertiary bg-bg-secondary border border-border-default"
                            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                          >
                            {s.step_number}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">{s.content_type}</span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-accent-gold truncate max-w-[120px] hidden md:table-cell">
                          {s.button_label || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-text-tertiary truncate max-w-[200px] hidden lg:table-cell">
                          {s.content_data?.substring(0, 60)}...
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => handleDelete(s.id)}
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
