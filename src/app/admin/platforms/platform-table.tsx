"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePlatform, deletePlatform, type ActionResult } from "@/app/actions/admin";

type PlatformRow = { id: string; name: string; icon_url: string | null; status: string; created_at: string };

function EditRow({ platform, onClose }: { platform: PlatformRow; onClose: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ActionResult, FormData>(async (prev, formData) => {
    const result = await updatePlatform(prev, formData);
    if (result?.success) {
      onClose();
      router.refresh();
    }
    return result;
  }, null);

  return (
    <form action={action} className="py-4 space-y-4" style={{ borderBottom: "1px solid var(--p-border)" }}>
      <input type="hidden" name="id" value={platform.id} />
      {state?.error && <p className="mx-notice mx-notice-error">{state.error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="mx-field-label" htmlFor={`name-${platform.id}`}>Nama *</label>
          <input id={`name-${platform.id}`} name="name" required defaultValue={platform.name} className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor={`icon-${platform.id}`}>Icon URL</label>
          <input id={`icon-${platform.id}`} name="icon_url" defaultValue={platform.icon_url ?? ""} placeholder="https://…" className="mx-input font-mono" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor={`status-${platform.id}`}>Status</label>
          <select id={`status-${platform.id}`} name="status" defaultValue={platform.status} className="mx-input">
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className="mx-btn mx-btn-solid">{pending ? "Menyimpan…" : "Simpan"}</button>
        <button type="button" className="mx-link" onClick={onClose}>Batal</button>
      </div>
    </form>
  );
}

export function PlatformTable({ platforms }: { platforms: PlatformRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(p: PlatformRow) {
    if (!window.confirm(`Hapus platform "${p.name}"?\n\nPlatform tidak lagi tampil di portal. Data kendala & solusinya tetap tersimpan.`)) return;
    const result = await deletePlatform(p.id);
    if (result?.error) setError(result.error);
    else router.refresh();
  }

  if (platforms.length === 0) return <p className="mx-empty">Belum ada platform.</p>;

  return (
    <div>
      {error && <p className="mx-notice mx-notice-error mb-4">{error}</p>}
      <div className="mx-list">
        {platforms.map((p, i) =>
          editingId === p.id ? (
            <EditRow key={p.id} platform={p} onClose={() => setEditingId(null)} />
          ) : (
            <div key={p.id} className="mx-row">
              <span className="mx-num w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="mx-row-title">
                  {p.name}
                  {p.status !== "active" && <span className="mx-num ml-2">· nonaktif</span>}
                </p>
                <p className="mx-row-desc font-mono truncate">{p.icon_url || "Ikon bawaan"}</p>
              </div>
              <div className="flex gap-4 shrink-0 self-center">
                <button type="button" className="mx-link" onClick={() => setEditingId(p.id)}>Edit</button>
                <button type="button" className="mx-link mx-link-danger" onClick={() => handleDelete(p)}>Hapus</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
