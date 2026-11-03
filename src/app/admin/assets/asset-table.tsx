"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AssetForm, ASSET_TYPES, type Asset } from "./asset-form";

const TYPE_LABELS: Record<string, string> = Object.fromEntries(ASSET_TYPES.map((t) => [t.value, t.label]));

export function AssetTable({ assets: initialAssets }: { assets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleActive(asset: Asset) {
    setBusyId(asset.id);
    const { error: updateError } = await createClient().from("assets").update({ is_active: !asset.is_active }).eq("id", asset.id);
    if (updateError) setError(updateError.message);
    else setAssets((prev) => prev.map((a) => (a.id === asset.id ? { ...a, is_active: !a.is_active } : a)));
    setBusyId(null);
  }

  async function deleteAsset(asset: Asset) {
    if (!window.confirm(`Hapus aset "${asset.title || TYPE_LABELS[asset.asset_type] || asset.asset_type}" secara permanen?`)) return;
    setBusyId(asset.id);
    const { error: deleteError } = await createClient().from("assets").delete().eq("id", asset.id);
    if (deleteError) setError(deleteError.message);
    else {
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      if (editing?.id === asset.id) setEditing(null);
    }
    setBusyId(null);
  }

  function startEdit(asset: Asset) {
    setEditing(asset);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mx-section-head">
          <h2 className="mx-subtitle">{editing ? <>Edit &ldquo;{editing.title || TYPE_LABELS[editing.asset_type]}&rdquo;</> : "Tambah aset"}</h2>
        </div>
        <AssetForm
          key={formKey}
          asset={editing}
          onSaved={(saved, isNew) => {
            setAssets((prev) => (isNew ? [saved, ...prev] : prev.map((a) => (a.id === saved.id ? saved : a))));
            if (!isNew) {
              setEditing(null);
              setFormKey((k) => k + 1);
            }
          }}
          onCancel={() => {
            setEditing(null);
            setFormKey((k) => k + 1);
          }}
        />
      </section>

      <section>
        <div className="mx-section-head">
          <h2 className="mx-subtitle">Aset terdaftar</h2>
          <span className="mx-num">{assets.length} aset</span>
        </div>

        {error && <p className="mx-notice mx-notice-error mb-4">{error}</p>}

        {assets.length === 0 ? (
          <p className="mx-empty">Belum ada aset.</p>
        ) : (
          <div className="mx-list">
            {assets.map((asset) => (
              <div key={asset.id} className="mx-row" style={busyId === asset.id ? { opacity: 0.5 } : undefined}>
                <span className="mx-label w-24 shrink-0">{TYPE_LABELS[asset.asset_type] || asset.asset_type}</span>
                <div className="min-w-0 flex-1">
                  <p className="mx-row-title">
                    {asset.title || "Tanpa judul"}
                    {!asset.is_active && <span className="mx-num ml-2">· nonaktif</span>}
                  </p>
                  <p className="mx-row-desc line-clamp-2">{asset.description || asset.content}</p>
                </div>
                <div className="flex gap-4 shrink-0 self-center">
                  <button type="button" className="mx-link" disabled={busyId === asset.id} onClick={() => toggleActive(asset)}>
                    {asset.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button type="button" className="mx-link" onClick={() => startEdit(asset)}>Edit</button>
                  <button type="button" className="mx-link mx-link-danger" disabled={busyId === asset.id} onClick={() => deleteAsset(asset)}>
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
