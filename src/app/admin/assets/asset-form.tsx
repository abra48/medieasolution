"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ASSET_TYPES = [
  { value: "article", label: "Artikel" },
  { value: "service", label: "Layanan" },
  { value: "banner", label: "Banner" },
  { value: "pop_up", label: "Pop-Up" },
  { value: "testimonial", label: "Testimonial" },
];

export function AssetForm() {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const asset_type = formData.get("asset_type") as string;
    const title = (formData.get("title") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const content = (formData.get("content") as string)?.trim();
    const image_url = (formData.get("image_url") as string)?.trim() || null;
    const link_url = (formData.get("link_url") as string)?.trim() || null;

    if (!content) {
      setFeedback({ type: "error", msg: "Konten wajib diisi." });
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("assets").insert({
      asset_type, title, description, content, image_url, link_url, is_active: true,
    });

    if (error) {
      setFeedback({ type: "error", msg: error.message });
    } else {
      setFeedback({ type: "success", msg: `Aset "${title || asset_type}" berhasil ditambahkan.` });
      (e.target as HTMLFormElement).reset();
    }
    setPending(false);
  };

  return (
    <div
      className="bg-bg-secondary border border-border-default"
      style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
    >
      <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
        <div className="w-7 h-7 flex items-center justify-center bg-accent-gold/15 text-accent-gold"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-text-primary">Tambah Aset</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {feedback && (
          <div className={`px-3 py-2 text-xs border ${feedback.type === "error" ? "bg-[#EF4444]/10 border-[#EF4444]/20 text-danger" : "bg-accent-green/10 border-accent-green/20 text-accent-green"}`}
            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
          >{feedback.msg}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Tipe Aset *</label>
            <select name="asset_type" required className="input !py-2 text-sm">
              {ASSET_TYPES.map((at) => (
                <option key={at.value} value={at.value}>{at.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Judul</label>
            <input name="title" placeholder="Judul aset" className="input !py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Deskripsi</label>
            <input name="description" placeholder="Deskripsi singkat" className="input !py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Image URL</label>
            <input name="image_url" placeholder="https://..." className="input !py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Link URL</label>
            <input name="link_url" placeholder="https://..." className="input !py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">Konten *</label>
          <textarea name="content" required rows={4} placeholder="Konten aset..." className="input !py-2 text-sm resize-y min-h-[80px]" />
        </div>

        <button type="submit" disabled={pending} className="btn-primary !py-2 text-sm disabled:opacity-50">
          {pending ? "Menyimpan..." : "Simpan Aset"}
        </button>
      </form>
    </div>
  );
}
