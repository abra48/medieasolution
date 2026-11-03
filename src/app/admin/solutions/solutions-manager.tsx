"use client";

import { useState, useCallback, useActionState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { createSolution, updateSolution, deleteSolution, type ActionResult } from "@/app/actions/admin";
import { getIssuesTable, getSolutionsTable } from "@/lib/platform-tables";
import { parseButtons, MAX_SOLUTION_BUTTONS } from "@/lib/solution-buttons";

type Platform = { id: string; name: string };
type Issue = { id: string; issue_name: string };
type SolutionRow = {
  id: string;
  issue_id: string;
  step_number: number;
  content_type: string;
  content_data: string;
  content_data_en: string | null;
  method_group: string;
  button_label: string | null;
  button_link: string | null;
  created_at: string;
};

const CONTENT_TYPES = [
  { value: "text", label: "Teks panduan", hint: "Tulis langkah per baris. Gunakan **teks** untuk huruf tebal." },
  { value: "video", label: "Video", hint: "Tempel URL YouTube / Vimeo." },
  { value: "template", label: "Template", hint: "Teks yang bisa disalin pengguna (misalnya surat banding)." },
  { value: "link", label: "Link", hint: "Instruksi singkat; isi tombol link di bawah." },
];

/* ——— Add / edit form ——— */
function SolutionForm({
  platformName,
  issues,
  solution,
  defaultIssueId,
  onDone,
  onCancel,
}: {
  platformName: string;
  issues: Issue[];
  solution: SolutionRow | null;
  defaultIssueId: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!solution;
  const [contentType, setContentType] = useState(solution?.content_type ?? "text");
  const buttons = parseButtons(solution?.button_label ?? null, solution?.button_link ?? null);
  const [state, action, pending] = useActionState<ActionResult, FormData>(async (prev, formData) => {
    const result = await (isEdit ? updateSolution : createSolution)(prev, formData);
    if (result?.success) onDone();
    return result;
  }, null);

  const type = CONTENT_TYPES.find((ct) => ct.value === contentType) ?? CONTENT_TYPES[0];
  const isVideo = contentType === "video";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="platform_name" value={platformName} />
      {solution && <input type="hidden" name="id" value={solution.id} />}
      <input type="hidden" name="content_type" value={contentType} />

      {state?.error && <p className="mx-notice mx-notice-error">{state.error}</p>}
      {state?.success && <p className="mx-notice">{state.message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="sm:col-span-2">
          <label className="mx-field-label" htmlFor="issue_id">Kendala *</label>
          <select id="issue_id" name="issue_id" required defaultValue={solution?.issue_id ?? defaultIssueId} className="mx-input">
            <option value="">{issues.length ? "Pilih kendala" : "Belum ada kendala"}</option>
            {issues.map((issue) => (
              <option key={issue.id} value={issue.id}>{issue.issue_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mx-field-label" htmlFor="method_group">Metode</label>
          <input id="method_group" name="method_group" defaultValue={solution?.method_group ?? "Cara 1"} placeholder="Cara 1" className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="step_number">Langkah *</label>
          <input id="step_number" name="step_number" type="number" min={1} max={50} required defaultValue={solution?.step_number ?? 1} className="mx-input font-mono" />
        </div>
      </div>

      <div>
        <p className="mx-field-label">Tipe konten</p>
        <div className="mx-tabs">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setContentType(ct.value)}
              className={`mx-tab ${contentType === ct.value ? "mx-tab-active" : ""}`}
            >
              {ct.label}
            </button>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--p-muted)" }}>{type.hint}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="mx-field-label" htmlFor="content_data">{isVideo ? "URL video *" : "Konten — Bahasa Indonesia *"}</label>
          {isVideo ? (
            <input id="content_data" name="content_data" type="url" required defaultValue={solution?.content_data ?? ""} placeholder="https://www.youtube.com/watch?v=…" className="mx-input font-mono" />
          ) : (
            <textarea id="content_data" name="content_data" required rows={9} defaultValue={solution?.content_data ?? ""} className="mx-input" />
          )}
        </div>
        <div>
          <label className="mx-field-label" htmlFor="content_data_en">{isVideo ? "URL video (EN, opsional)" : "Konten — English"}</label>
          {isVideo ? (
            <input id="content_data_en" name="content_data_en" type="url" defaultValue={solution?.content_data_en ?? ""} placeholder="Kosongkan untuk memakai video yang sama" className="mx-input font-mono" />
          ) : (
            <textarea id="content_data_en" name="content_data_en" rows={9} defaultValue={solution?.content_data_en ?? ""} placeholder="Kosongkan untuk memakai versi Indonesia" className="mx-input" />
          )}
        </div>
      </div>

      <div>
        <p className="mx-field-label">Tombol link (maks. {MAX_SOLUTION_BUTTONS}, opsional)</p>
        <div className="mx-list">
          {Array.from({ length: MAX_SOLUTION_BUTTONS }, (_, i) => i + 1).map((n) => (
            <div key={n} className="grid grid-cols-[24px_1fr] sm:grid-cols-[24px_1fr_1.4fr] gap-3 items-center py-3" style={{ borderBottom: "1px solid var(--p-border)" }}>
              <span className="mx-num">{String(n).padStart(2, "0")}</span>
              <input name={`button_label_${n}`} defaultValue={buttons[n - 1]?.label ?? ""} placeholder="Label, mis. Buka formulir pemulihan" aria-label={`Label tombol ${n}`} className="mx-input" />
              <input name={`button_link_${n}`} type="url" defaultValue={buttons[n - 1]?.link ?? ""} placeholder="https://…" aria-label={`URL tombol ${n}`} className="mx-input font-mono col-start-2 sm:col-start-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className="mx-btn mx-btn-solid">
          {pending ? "Menyimpan…" : isEdit ? "Simpan perubahan" : "Tambah langkah"}
        </button>
        {isEdit && (
          <button type="button" className="mx-link" onClick={onCancel}>Batal edit</button>
        )}
      </div>
    </form>
  );
}

export function SolutionsManager({ platforms }: { platforms: Platform[] }) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [issueFilter, setIssueFilter] = useState("");
  const [editing, setEditing] = useState<SolutionRow | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (platformName: string) => {
    setLoading(true);
    const supabase = createClient();
    const [issuesRes, solutionsRes] = await Promise.all([
      supabase.from(getIssuesTable(platformName)).select("id, issue_name").order("issue_name"),
      supabase
        .from(getSolutionsTable(platformName))
        .select("id, issue_id, step_number, content_type, content_data, content_data_en, method_group, button_label, button_link, created_at")
        .order("method_group")
        .order("step_number"),
    ]);
    setError(issuesRes.error?.message ?? solutionsRes.error?.message ?? null);
    setIssues(issuesRes.data || []);
    setSolutions(solutionsRes.data || []);
    setLoading(false);
  }, []);

  function choosePlatform(p: Platform) {
    setSelectedPlatform(p);
    setEditing(null);
    setIssueFilter("");
    fetchData(p.name);
  }

  function resetForm() {
    setEditing(null);
    setFormKey((k) => k + 1);
  }

  function startEdit(s: SolutionRow) {
    setEditing(s);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(s: SolutionRow) {
    if (!selectedPlatform) return;
    if (!window.confirm(`Hapus ${s.method_group || "Cara 1"} · langkah ${s.step_number}?`)) return;
    const result = await deleteSolution(selectedPlatform.name, s.id);
    if (result?.error) setError(result.error);
    else {
      if (editing?.id === s.id) resetForm();
      fetchData(selectedPlatform.name);
    }
  }

  const issueMap = useMemo(() => new Map(issues.map((i) => [i.id, i.issue_name])), [issues]);
  const visible = issueFilter ? solutions.filter((s) => s.issue_id === issueFilter) : solutions;

  return (
    <div className="space-y-10">
      <div>
        <p className="mx-label mb-3">Platform</p>
        <div className="mx-tabs">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choosePlatform(p)}
              className={`mx-tab ${selectedPlatform?.id === p.id ? "mx-tab-active" : ""}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {!selectedPlatform ? (
        <p className="mx-empty">Pilih platform untuk mengelola langkah solusi.</p>
      ) : (
        <>
          <section>
            <div className="mx-section-head">
              <h2 className="mx-subtitle">
                {editing
                  ? <>Edit {editing.method_group || "Cara 1"} · langkah {editing.step_number}</>
                  : <>Tambah langkah — {selectedPlatform.name}</>}
              </h2>
            </div>
            {!loading && (
              <SolutionForm
                key={`${selectedPlatform.id}-${formKey}`}
                platformName={selectedPlatform.name}
                issues={issues}
                solution={editing}
                defaultIssueId={issueFilter}
                onDone={() => {
                  resetForm();
                  fetchData(selectedPlatform.name);
                }}
                onCancel={resetForm}
              />
            )}
          </section>

          <section>
            <div className="mx-section-head flex-wrap">
              <h2 className="mx-subtitle">
                Langkah terdaftar <span className="mx-num">{visible.length}</span>
              </h2>
              <select value={issueFilter} onChange={(e) => setIssueFilter(e.target.value)} className="mx-input !w-auto max-w-full" aria-label="Filter kendala">
                <option value="">Semua kendala</option>
                {issues.map((issue) => (
                  <option key={issue.id} value={issue.id}>{issue.issue_name}</option>
                ))}
              </select>
            </div>

            {error && <p className="mx-notice mx-notice-error mb-4">{error}</p>}

            {loading ? (
              <p className="mx-empty">Memuat…</p>
            ) : visible.length === 0 ? (
              <p className="mx-empty">Belum ada langkah solusi.</p>
            ) : (
              <div className="mx-list">
                {visible.map((s) => {
                  const btnCount = parseButtons(s.button_label, s.button_link).length;
                  return (
                    <div key={s.id} className="mx-row">
                      <span className="mx-num w-6 shrink-0">{String(s.step_number).padStart(2, "0")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="mx-row-title">
                          {issueMap.get(s.issue_id) || "—"}
                          <span className="mx-num ml-2">
                            {s.method_group || "Cara 1"} · {s.content_type}
                            {s.content_data_en ? " · EN" : ""}
                            {btnCount ? ` · ${btnCount} tombol` : ""}
                          </span>
                        </p>
                        <p className="mx-row-desc line-clamp-2">{s.content_data}</p>
                      </div>
                      <div className="flex gap-4 shrink-0 self-center">
                        <button type="button" className="mx-link" onClick={() => startEdit(s)}>Edit</button>
                        <button type="button" className="mx-link mx-link-danger" onClick={() => handleDelete(s)}>Hapus</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
