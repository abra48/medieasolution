"use client";

import { useActionState, useState, useMemo } from "react";
import { createSolution, type ActionResult } from "@/app/actions/admin";

type Platform = { id: string; name: string };
type Issue = { id: string; platform_id: string; issue_name: string };

const CONTENT_TYPES = [
  { value: "text", label: "Teks / Panduan", icon: "¶" },
  { value: "video", label: "Video", icon: "▶" },
  { value: "template", label: "Template / Bahan", icon: "⎘" },
  { value: "link", label: "Link", icon: "⛓" },
];

export function SolutionBuilder({
  platforms,
  issues,
}: {
  platforms: Platform[];
  issues: Issue[];
}) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(createSolution, null);
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [selectedContentType, setSelectedContentType] = useState("text");

  const filteredIssues = useMemo(
    () => issues.filter((i) => i.platform_id === selectedPlatformId),
    [issues, selectedPlatformId]
  );

  return (
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
          <h3 className="text-sm font-semibold text-text-primary">Solution Builder</h3>
          <p className="text-[10px] text-text-tertiary">Bangun langkah solusi untuk kendala tertentu</p>
        </div>
      </div>

      <form action={action} className="p-5 space-y-5">
        {/* Feedback */}
        {state?.error && (
          <div className="px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-danger"
            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
          >{state.error}</div>
        )}
        {state?.success && (
          <div className="px-3 py-2 bg-accent-green/10 border border-accent-green/20 text-xs text-accent-green"
            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
          >{state.message}</div>
        )}

        {/* Row 1: Platform → Issue selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Platform Selector */}
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
              1. Pilih Platform *
            </label>
            <select
              value={selectedPlatformId}
              onChange={(e) => setSelectedPlatformId(e.target.value)}
              className="input !py-2 text-sm"
            >
              <option value="">— Pilih Platform —</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Issue Selector (filtered) */}
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
              2. Pilih Kendala *
            </label>
            <select
              name="issue_id"
              required
              className="input !py-2 text-sm"
              disabled={!selectedPlatformId}
            >
              <option value="">
                {selectedPlatformId
                  ? filteredIssues.length === 0
                    ? "— Tidak ada kendala —"
                    : "— Pilih Kendala —"
                  : "— Pilih platform terlebih dahulu —"}
              </option>
              {filteredIssues.map((issue) => (
                <option key={issue.id} value={issue.id}>{issue.issue_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Step config */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Step Number */}
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

          {/* Method Group */}
          <div>
            <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
              Metode Grup
            </label>
            <input
              name="method_group"
              defaultValue="Cara 1"
              placeholder="e.g., Cara 1, Cara 2"
              className="input !py-2 text-sm"
            />
          </div>

          {/* Content Type */}
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

          {/* Shortcut URL — for template & link types */}
          {(selectedContentType === "template" || selectedContentType === "link") && (
            <div
              className="bg-accent-gold/5 border border-accent-gold/20 p-3 space-y-2"
              style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="text-xs font-semibold text-accent-gold">Tombol Shortcut</span>
              </div>
              <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">
                URL Shortcut (Tombol Aksi)
              </label>
              <input
                name="shortcut_url"
                type="url"
                placeholder="https://help.platform.com/recovery-form"
                className="input !py-2 text-sm font-mono"
              />
              <p className="text-[10px] text-text-tertiary">
                URL ini akan muncul sebagai tombol emas prominent di sisi pengguna. Biarkan kosong jika tidak diperlukan.
              </p>
            </div>
          )}

          {/* Shortcut URL for text type — optional */}
          {selectedContentType === "text" && (
            <div>
              <label className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5">
                URL Shortcut (Opsional)
              </label>
              <input
                name="shortcut_url"
                type="url"
                placeholder="https://..."
                className="input !py-2 text-sm font-mono"
              />
              <p className="text-[10px] text-text-tertiary mt-1">
                Jika diisi, tombol shortcut akan ditampilkan di bawah panduan teks.
              </p>
            </div>
          )}
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
  );
}
