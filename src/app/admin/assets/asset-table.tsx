"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Asset = {
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

const TYPE_LABELS: Record<string, string> = {
  article: "Artikel",
  service: "Layanan",
  banner: "Banner",
  pop_up: "Pop-Up",
  testimonial: "Testimonial",
};

export function AssetTable({ assets: initialAssets }: { assets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleActive = useCallback(async (id: string, currentState: boolean) => {
    setTogglingId(id);
    const supabase = createClient();
    const { error } = await supabase
      .from("assets")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (!error) {
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: !currentState } : a))
      );
    }
    setTogglingId(null);
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("assets").delete().eq("id", id);
    if (!error) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
    }
    setDeletingId(null);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary">Registrasi Aset</h2>
        <span className="text-xs text-text-tertiary">{assets.length} aset</span>
      </div>

      <div
        className="border border-border-default overflow-hidden"
        style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary border-b border-border-default">
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Tipe</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Judul</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Konten</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Status</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Dibuat</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {assets.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-tertiary text-sm">
                    Belum ada aset. Gunakan form di atas untuk menambahkan konten.
                  </td>
                </tr>
              )}
              {assets.map((asset) => (
                <tr key={asset.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                  {/* Type */}
                  <td className="px-4 py-2.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider text-accent-gold bg-accent-gold/10 px-1.5 py-0.5"
                      style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                    >
                      {TYPE_LABELS[asset.asset_type] || asset.asset_type}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="px-4 py-2.5 text-sm font-medium text-text-primary max-w-[180px] truncate">
                    {asset.title || "—"}
                  </td>

                  {/* Content Preview */}
                  <td className="px-4 py-2.5 text-xs text-text-tertiary truncate max-w-[200px] hidden sm:table-cell">
                    {asset.content?.substring(0, 50) || "—"}
                  </td>

                  {/* Status Toggle */}
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => toggleActive(asset.id, asset.is_active)}
                      disabled={togglingId === asset.id}
                      className="group"
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200
                          ${asset.is_active
                            ? "bg-accent-green/10 text-accent-green hover:bg-accent-green/20"
                            : "bg-bg-tertiary text-text-tertiary hover:bg-bg-elevated"
                          }
                          ${togglingId === asset.id ? "opacity-50" : ""}
                        `}
                        style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                      >
                        <span
                          className={`w-1.5 h-1.5 transition-colors ${asset.is_active ? "bg-accent-green" : "bg-text-tertiary"}`}
                          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                        />
                        {asset.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </button>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-2.5 text-xs text-text-tertiary hidden md:table-cell">
                    {new Date(asset.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => {
                        if (confirm("Hapus aset ini secara permanen?")) {
                          deleteAsset(asset.id);
                        }
                      }}
                      disabled={deletingId === asset.id}
                      className={`text-[10px] font-semibold uppercase tracking-wider text-text-tertiary hover:text-danger transition-colors
                        ${deletingId === asset.id ? "opacity-50" : ""}`}
                    >
                      {deletingId === asset.id ? "..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
