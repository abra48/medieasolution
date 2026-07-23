"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PortalWelcome({ hasAccess }: { hasAccess: boolean }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/redeem-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan.");
        setLoading(false);
        return;
      }

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push("/portal/troubleshoot");
          router.refresh();
        }, 1000);
        return;
      }
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    }

    setLoading(false);
  }

  // User already has access
  if (hasAccess) {
    return (
      <div className="max-w-2xl mx-auto py-4">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Pemulihan Akun
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Panduan langkah demi langkah untuk memulihkan akun media sosial Anda
            dengan template siap pakai dan tautan ke formulir resmi platform.
          </p>
        </div>

        <Steps />

        <div className="mt-8 p-5 rounded-xl border border-accent/20 bg-accent/[0.03]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Akses Premium Aktif</p>
              <p className="text-xs text-text-tertiary">Anda sudah memiliki akses ke semua panduan pemulihan.</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/portal/troubleshoot")}
            className="btn-primary w-full py-3 text-sm font-medium"
          >
            Mulai Pemulihan Akun
          </button>
        </div>
      </div>
    );
  }

  // No access — code entry
  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Pemulihan Akun
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Panduan langkah demi langkah untuk memulihkan akun media sosial Anda
          dengan template siap pakai dan tautan ke formulir resmi platform.
        </p>
      </div>

      <Steps />

      {/* Code Entry */}
      <div className="mt-8">
        <div className="p-5 rounded-xl border border-border-default bg-bg-secondary">
          <h2 className="text-sm font-semibold text-text-primary mb-1">Masukkan Kode Akses</h2>
          <p className="text-xs text-text-tertiary mb-4">
            Kode diberikan oleh admin untuk membuka panduan pemulihan premium.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger/5 border border-danger/15 text-sm text-danger">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/5 border border-accent/15 text-sm text-accent font-medium">
                <svg className="w-4 h-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {success}
              </div>
            )}

            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError("");
              }}
              placeholder="MASUKKAN KODE"
              className="input text-center tracking-[0.12em] font-mono py-3 text-sm uppercase"
              maxLength={20}
              autoComplete="off"
              disabled={loading || !!success}
            />

            <button
              type="submit"
              disabled={!code.trim() || loading || !!success}
              className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memvalidasi...
                </span>
              ) : success ? (
                "Berhasil"
              ) : (
                "Aktifkan Kode"
              )}
            </button>
          </form>

          <p className="text-[11px] text-text-tertiary text-center mt-3">
            Setiap kode hanya berlaku 1x pakai. Hubungi admin jika belum punya kode.
          </p>
        </div>
      </div>

      {/* Locked Preview */}
      <LockedPreview />
    </div>
  );
}

/* ——— Steps ——— */
function Steps() {
  const steps = [
    { num: "1", title: "Masukkan Kode", desc: "Gunakan kode unik dari admin" },
    { num: "2", title: "Pilih Platform", desc: "Facebook, Instagram, TikTok, dll" },
    { num: "3", title: "Pilih Kendala", desc: "Diretas, diblokir, atau terkunci" },
    { num: "4", title: "Ikuti Solusi", desc: "Panduan + template siap pakai" },
  ];

  return (
    <div>
      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
        Cara Kerja
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s) => (
          <div key={s.num} className="p-3.5 rounded-xl border border-border-subtle bg-bg-secondary/60">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-5 rounded-md bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center">
                {s.num}
              </span>
              <span className="text-xs font-semibold text-text-primary">{s.title}</span>
            </div>
            <p className="text-[11px] text-text-tertiary leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ——— Locked Preview ——— */
function LockedPreview() {
  return (
    <div className="mt-8 relative overflow-hidden rounded-xl border border-border-subtle">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/70 to-bg-primary z-10 flex items-end justify-center pb-6">
        <div className="text-center">
          <svg className="w-8 h-8 text-text-tertiary mx-auto mb-1.5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-xs text-text-tertiary">Masukkan kode untuk membuka</p>
        </div>
      </div>
      <div className="opacity-[0.06] pointer-events-none p-4">
        <div className="grid grid-cols-3 gap-2">
          {["Facebook", "Instagram", "TikTok", "YouTube", "WhatsApp", "Twitter"].map((n) => (
            <div key={n} className="px-4 py-3 rounded-lg border border-border-default bg-bg-secondary">
              <span className="text-sm text-text-primary">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
