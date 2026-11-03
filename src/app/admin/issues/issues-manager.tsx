"use client";

import { useState, useActionState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { createIssue, updateIssue, deleteIssue, type ActionResult } from "@/app/actions/admin";
import { getIssuesTable } from "@/lib/platform-tables";

type Platform = { id: string; name: string };
type Issue = {
  id: string;
  issue_name: string;
  description: string | null;
  issue_name_en: string | null;
  description_en: string | null;
  status: string;
  created_at: string;
};

/* ——— Add / edit form ——— */
function IssueForm({
  platformName,
  issue,
  onDone,
  onCancel,
}: {
  platformName: string;
  issue: Issue | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!issue;
  const [state, action, pending] = useActionState<ActionResult, FormData>(async (prev, formData) => {
    const result = await (isEdit ? updateIssue : createIssue)(prev, formData);
    if (result?.success) onDone();
    return result;
  }, null);

  return (
    <form action={action} className="space-y-5" key={issue?.id ?? "new"}>
      <input type="hidden" name="platform_name" value={platformName} />
      {issue && <input type="hidden" name="id" value={issue.id} />}

      {state?.error && <p className="mx-notice mx-notice-error">{state.error}</p>}
      {state?.success && <p className="mx-notice">{state.message}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="mx-field-label" htmlFor="issue_name">Nama kendala (ID) *</label>
          <input id="issue_name" name="issue_name" required defaultValue={issue?.issue_name ?? ""} placeholder="Akun terblokir permanen" className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="issue_name_en">Nama kendala (EN)</label>
          <input id="issue_name_en" name="issue_name_en" defaultValue={issue?.issue_name_en ?? ""} placeholder="Permanently disabled account" className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="description">Deskripsi (ID)</label>
          <textarea id="description" name="description" rows={3} defaultValue={issue?.description ?? ""} className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="description_en">Deskripsi (EN)</label>
          <textarea id="description_en" name="description_en" rows={3} defaultValue={issue?.description_en ?? ""} className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={issue?.status ?? "active"} className="mx-input">
            <option value="active">Aktif — tampil di portal</option>
            <option value="inactive">Nonaktif — disembunyikan</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className="mx-btn mx-btn-solid">
          {pending ? "Menyimpan…" : isEdit ? "Simpan perubahan" : "Tambah kendala"}
        </button>
        {isEdit && (
          <button type="button" className="mx-link" onClick={onCancel}>
            Batal edit
          </button>
        )}
      </div>
    </form>
  );
}

export function IssuesManager({ platforms }: { platforms: Platform[] }) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Issue | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async (platformName: string) => {
    setLoading(true);
    const { data, error: fetchError } = await createClient()
      .from(getIssuesTable(platformName))
      .select("id, issue_name, description, issue_name_en, description_en, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    setError(fetchError?.message ?? null);
    setIssues(data || []);
    setLoading(false);
  }, []);

  function choosePlatform(p: Platform) {
    setSelectedPlatform(p);
    setEditing(null);
    fetchIssues(p.name);
  }

  function startEdit(issue: Issue) {
    setEditing(issue);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishForm() {
    setEditing(null);
    setFormKey((k) => k + 1);
    if (selectedPlatform) fetchIssues(selectedPlatform.name);
  }

  async function handleDelete(issue: Issue) {
    if (!selectedPlatform) return;
    if (!window.confirm(`Hapus kendala "${issue.issue_name}"?\n\nSemua langkah solusi untuk kendala ini ikut terhapus.`)) return;
    const result = await deleteIssue(selectedPlatform.name, issue.id);
    if (result?.error) setError(result.error);
    else {
      if (editing?.id === issue.id) setEditing(null);
      fetchIssues(selectedPlatform.name);
    }
  }

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
        <p className="mx-empty">Pilih platform untuk mengelola kendala.</p>
      ) : (
        <>
          <section>
            <div className="mx-section-head">
              <h2 className="mx-subtitle">
                {editing ? <>Edit &ldquo;{editing.issue_name}&rdquo;</> : <>Tambah kendala — {selectedPlatform.name}</>}
              </h2>
            </div>
            <IssueForm
              key={`${selectedPlatform.id}-${formKey}`}
              platformName={selectedPlatform.name}
              issue={editing}
              onDone={finishForm}
              onCancel={() => {
                setEditing(null);
                setFormKey((k) => k + 1);
              }}
            />
          </section>

          <section>
            <div className="mx-section-head">
              <h2 className="mx-subtitle">Kendala terdaftar</h2>
              <span className="mx-num">{issues.length} kendala</span>
            </div>

            {error && <p className="mx-notice mx-notice-error mb-4">{error}</p>}

            {loading ? (
              <p className="mx-empty">Memuat…</p>
            ) : issues.length === 0 ? (
              <p className="mx-empty">Belum ada kendala untuk {selectedPlatform.name}.</p>
            ) : (
              <div className="mx-list">
                {issues.map((issue, i) => (
                  <div key={issue.id} className="mx-row">
                    <span className="mx-num w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="mx-row-title">
                        {issue.issue_name}
                        {issue.status !== "active" && <span className="mx-num ml-2">· nonaktif</span>}
                      </p>
                      {issue.issue_name_en && <p className="mx-row-desc italic">{issue.issue_name_en}</p>}
                      {issue.description && <p className="mx-row-desc">{issue.description}</p>}
                    </div>
                    <div className="flex gap-4 shrink-0 self-center">
                      <button type="button" className="mx-link" onClick={() => startEdit(issue)}>Edit</button>
                      <button type="button" className="mx-link mx-link-danger" onClick={() => handleDelete(issue)}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
