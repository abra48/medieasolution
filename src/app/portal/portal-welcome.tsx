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

  // User already has access → show CTA to go to troubleshoot
  if (hasAccess) {
    return (
      <div className="space-y-8 animate-fade-in">
        <Header />
        <HowItWorks />

        {/* CTA */}
        <div className="max-w-md mx-auto">
          <div className="card !p-6 !border-accent/25 !bg-accent/5 text-center">
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-accent mb-1">Akses Premium Aktif ✓</h3>
            <p className="text-sm text-text-tertiary mb-5">
              Anda sudah memiliki akses premium. Klik tombol di bawah untuk mulai.
            </p>
            <button
              onClick={() => router.push("/portal/troubleshoot")}
              className="btn-primary w-full py-3.5 text-sm font-semibold"
            >
              Mulai Pemulihan Akun →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No access → show code entry form
  return (
    <div className="space-y-8 animate-fade-in">
      <Header />
      <HowItWorks />

      {/* Code Entry Form */}
      <div className="max-w-md mx-auto">
        <div className="card !p-6">
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">Masukkan Kode Akses</h3>
            <p className="text-sm text-text-tertiary">
              Kode diberikan oleh admin untuk membuka panduan pemulihan premium.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 animate-fade-in">
                <svg className="w-4 h-4 text-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="text-sm text-danger">{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 animate-fade-in">
                <svg className="w-4 h-4 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm font-medium text-accent">{success}</span>
              </div>
            )}

            {/* Input */}
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError("");
              }}
              placeholder="MASUKKAN KODE AKSES"
              className="input text-center tracking-[0.15em] font-mono py-4 text-base uppercase"
              maxLength={20}
              autoComplete="off"
              disabled={loading || !!success}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={!code.trim() || loading || !!success}
              className="btn-primary w-full py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memvalidasi kode...
                </span>
              ) : success ? (
                "✓ Berhasil!"
              ) : (
                "Aktifkan Kode"
              )}
            </button>
          </form>

          <p className="text-xs text-text-tertiary text-center mt-4">
            Setiap kode hanya berlaku 1x pakai. Hubungi admin jika belum punya kode.
          </p>
        </div>
      </div>

      {/* Locked Preview */}
      <LockedPreview />
    </div>
  );
}

/* ——— Sub-Components ——— */

function Header() {
  return (
    <div className="text-center max-w-xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">Recovery Portal</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
        Pulihkan Akun Media Sosial Anda
      </h1>
      <p className="text-sm text-text-secondary leading-relaxed">
        Panduan langkah demi langkah dengan template siap pakai dan tautan langsung ke formulir resmi platform.
      </p>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Masukkan Kode", desc: "Gunakan kode unik dari admin." },
    { num: "02", title: "Pilih Platform", desc: "Facebook, Instagram, TikTok, dll." },
    { num: "03", title: "Pilih Kendala", desc: "Diretas, diblokir, atau terkunci." },
    { num: "04", title: "Ikuti Solusi", desc: "Panduan + template siap pakai." },
  ];

  return (
    <div>
      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3 text-center">
        Cara Kerja
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {steps.map((s) => (
          <div key={s.num} className="card !p-3.5 group hover:border-accent/30">
            <span className="text-[10px] font-mono text-accent">{s.num}</span>
            <h3 className="text-xs font-semibold text-text-primary mt-0.5">{s.title}</h3>
            <p className="text-[11px] text-text-tertiary mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LockedPreview() {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-bg-primary/80 to-bg-primary z-10 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 text-text-tertiary mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-sm font-medium text-text-secondary">Konten Terkunci</p>
          <p className="text-xs text-text-tertiary mt-1">Masukkan kode akses untuk membuka</p>
        </div>
      </div>
      <div className="opacity-10 pointer-events-none p-4">
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
