"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Asset = {
  id: string;
  asset_type: string;
  title: string | null;
  description: string | null;
  content: string;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
};

export const ASSET_TYPES = [
  { value: "article", label: "Artikel / FAQ" },
  { value: "banner", label: "Banner" },
  { value: "pop_up", label: "Pop-up" },
  { value: "testimonial", label: "Testimonial" },
  { value: "service", label: "Layanan" },
];

const FIELDS = "id, asset_type, title, description, content, image_url, link_url, is_active, created_at";

/** Form tambah / edit aset. `asset` diisi = mode edit. */
export function AssetForm({
  asset,
  onSaved,
  onCancel,
}: {
  asset: Asset | null;
  onSaved: (saved: Asset, isNew: boolean) => void;
  onCancel: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const value = (key: string) => ((formData.get(key) as string | null) ?? "").trim();

    const payload = {
      asset_type: value("asset_type"),
      title: value("title") || null,
      description: value("description") || null,
      content: value("content"),
      image_url: value("image_url") || null,
      link_url: value("link_url") || null,
    };
    if (!payload.content) {
      setFeedback({ type: "error", msg: "Konten wajib diisi." });
      return;
    }

    setPending(true);
    setFeedback(null);
    const supabase = createClient();
    const { data, error } = asset
      ? await supabase.from("assets").update(payload).eq("id", asset.id).select(FIELDS).single()
      : await supabase.from("assets").insert({ ...payload, is_active: true }).select(FIELDS).single();
    setPending(false);

    if (error || !data) {
      setFeedback({ type: "error", msg: error?.message ?? "Gagal menyimpan." });
      return;
    }
    setFeedback({ type: "ok", msg: asset ? "Perubahan disimpan." : `Aset "${payload.title || payload.asset_type}" ditambahkan.` });
    if (!asset) form.reset();
    onSaved(data as Asset, !asset);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" key={asset?.id ?? "new"}>
      {feedback && <p className={`mx-notice ${feedback.type === "error" ? "mx-notice-error" : ""}`}>{feedback.msg}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="mx-field-label" htmlFor="asset_type">Tipe *</label>
          <select id="asset_type" name="asset_type" required defaultValue={asset?.asset_type ?? "article"} className="mx-input">
            {ASSET_TYPES.map((at) => (
              <option key={at.value} value={at.value}>{at.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mx-field-label" htmlFor="asset_title">Judul</label>
          <input id="asset_title" name="title" defaultValue={asset?.title ?? ""} className="mx-input" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="asset_description">Deskripsi</label>
          <input id="asset_description" name="description" defaultValue={asset?.description ?? ""} className="mx-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="mx-field-label" htmlFor="asset_image">Image URL</label>
          <input id="asset_image" name="image_url" defaultValue={asset?.image_url ?? ""} placeholder="Salin dari menu Gallery" className="mx-input font-mono" />
        </div>
        <div>
          <label className="mx-field-label" htmlFor="asset_link">Link URL</label>
          <input id="asset_link" name="link_url" defaultValue={asset?.link_url ?? ""} placeholder="https://…" className="mx-input font-mono" />
        </div>
      </div>

      <div>
        <label className="mx-field-label" htmlFor="asset_content">Konten *</label>
        <textarea id="asset_content" name="content" required rows={4} defaultValue={asset?.content ?? ""} className="mx-input" />
      </div>

      <div className="flex items-center gap-5">
        <button type="submit" disabled={pending} className="mx-btn mx-btn-solid">
          {pending ? "Menyimpan…" : asset ? "Simpan perubahan" : "Tambah aset"}
        </button>
        {asset && <button type="button" className="mx-link" onClick={onCancel}>Batal edit</button>}
      </div>
    </form>
  );
}
