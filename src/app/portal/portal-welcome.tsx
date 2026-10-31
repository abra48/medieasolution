"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const gxDark = "#0a0a0a";
const gxLight = "#f5f3ee";
const gxMuted = "#7a7a72";
const gxBorder = "rgba(255,255,255,0.08)";
const gxSerif = 'Georgia, "Times New Roman", serif';
const gxMono = '"SF Mono", "Fira Code", monospace';

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
      if (!res.ok) { setError(data.error || "Terjadi kesalahan."); setLoading(false); return; }
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => { router.push("/portal/troubleshoot"); router.refresh(); }, 1000);
        return;
      }
    } catch { setError("Gagal terhubung ke server. Coba lagi."); }
    setLoading(false);
  }

  if (hasAccess) {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 0", animation: "gx-fade-up 0.6s ease both" }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: gxMono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: gxMuted, marginBottom: 12 }}>
            ● PREMIUM AKTIF
          </p>
          <h1 style={{ fontFamily: gxSerif, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 400, fontStyle: "italic", color: "#e8e6e1", letterSpacing: "-0.01em", marginBottom: 8, lineHeight: 1.2 }}>
            Selamat Datang di Mediea Solution
          </h1>
          <p style={{ fontSize: 14, color: gxMuted, lineHeight: 1.7 }}>
            Platform pemulihan akun media sosial dengan panduan langkah demi langkah.
          </p>
        </div>

        {/* Stats Grid - cross style */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: gxBorder, border: `1px solid ${gxBorder}`, marginBottom: 48 }}>
          {[
            { value: "8+", label: "PLATFORM" },
            { value: "200+", label: "SOLUSI" },
            { value: "50+", label: "TEMPLATE" },
            { value: "30+", label: "VIDEO" },
          ].map((s) => (
            <div key={s.label} style={{ background: gxDark, padding: "28px 20px", textAlign: "center" as const }}>
              <p style={{ fontFamily: gxSerif, fontSize: "clamp(1.5rem, 3vw, 2rem)", fontStyle: "italic", color: "#e8e6e1", marginBottom: 6 }}>{s.value}</p>
              <p style={{ fontFamily: gxMono, fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: gxMuted }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: gxMono, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: gxMuted, marginBottom: 20 }}>
            AKSI CEPAT
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: gxBorder }}>
            {[
              { label: "Mulai Pemulihan Akun", desc: "Pilih platform dan ikuti panduan", href: "/portal/troubleshoot", num: "01" },
              { label: "Baca Artikel", desc: "Tips keamanan akun digital", href: "/portal/articles", num: "02" },
              { label: "Hubungi Support", desc: "Butuh bantuan? Chat kami", href: "/portal/support", num: "03" },
              { label: "Learning Modules", desc: "Pelajari keamanan digital", href: "/portal/modules", num: "04" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ background: gxDark, padding: "24px 20px", textDecoration: "none", display: "block", transition: "background 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#141414")}
                onMouseLeave={(e) => (e.currentTarget.style.background = gxDark)}
              >
                <span style={{ fontFamily: gxMono, fontSize: 9, color: "rgba(122,122,114,0.5)", display: "block", marginBottom: 8 }}>{item.num}</span>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#e8e6e1", marginBottom: 4, letterSpacing: "0.03em", textTransform: "uppercase" as const }}>{item.label}</p>
                <p style={{ fontSize: 12, color: gxMuted }}>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "28px 24px", border: `1px solid ${gxBorder}` }}>
          <p style={{ fontFamily: gxMono, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: gxMuted, marginBottom: 6 }}>● AKSES PREMIUM AKTIF</p>
          <p style={{ fontSize: 13, color: gxMuted, marginBottom: 20 }}>Anda sudah memiliki akses ke semua panduan pemulihan.</p>
          <button
            onClick={() => router.push("/portal/troubleshoot")}
            style={{
              width: "100%", padding: "14px 0", background: "#1a1a1a", color: "#e8e6e1", border: `1px solid ${gxBorder}`,
              fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer",
              transition: "all 0.3s ease", fontFamily: "inherit"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a1a")}
          >
            MULAI PEMULIHAN AKUN →
          </button>
        </div>
      </div>
    );
  }

  // No access — code entry
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 0" }}>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontFamily: gxSerif, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 400, fontStyle: "italic", color: "#e8e6e1", letterSpacing: "-0.01em", marginBottom: 12, lineHeight: 1.2 }}>
          Pemulihan Akun
        </h1>
        <p style={{ fontSize: 14, color: gxMuted, lineHeight: 1.7 }}>
          Panduan langkah demi langkah untuk memulihkan akun media sosial Anda dengan template siap pakai dan tautan ke formulir resmi platform.
        </p>
      </div>

      {/* Steps */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: gxMono, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: gxMuted, marginBottom: 16 }}>CARA KERJA</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: gxBorder }}>
          {[
            { num: "01", title: "Masukkan Kode", desc: "Gunakan kode unik dari admin" },
            { num: "02", title: "Pilih Platform", desc: "Facebook, Instagram, TikTok, dll" },
            { num: "03", title: "Pilih Kendala", desc: "Diretas, diblokir, atau terkunci" },
            { num: "04", title: "Ikuti Solusi", desc: "Panduan + template siap pakai" },
          ].map((s) => (
            <div key={s.num} style={{ background: gxDark, padding: "20px 16px" }}>
              <span style={{ fontFamily: gxMono, fontSize: 9, color: "rgba(122,122,114,0.5)", display: "block", marginBottom: 8 }}>{s.num}</span>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#e8e6e1", marginBottom: 4, letterSpacing: "0.03em", textTransform: "uppercase" as const }}>{s.title}</p>
              <p style={{ fontSize: 11, color: gxMuted }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Code Entry */}
      <div style={{ padding: "28px 24px", border: `1px solid ${gxBorder}` }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: "#e8e6e1", letterSpacing: "0.05em", textTransform: "uppercase" as const, marginBottom: 4 }}>Masukkan Kode Akses</h2>
        <p style={{ fontSize: 12, color: gxMuted, marginBottom: 20 }}>Kode diberikan oleh admin untuk membuka panduan pemulihan premium.</p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.05)" }}>
              {success}
            </div>
          )}
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); if (error) setError(""); }}
            placeholder="MASUKKAN KODE"
            maxLength={20}
            autoComplete="off"
            disabled={loading || !!success}
            style={{
              width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: `1px solid ${gxBorder}`,
              color: "#e8e6e1", fontSize: 13, letterSpacing: "0.1em", textAlign: "center" as const,
              fontFamily: gxMono, marginBottom: 12, outline: "none", boxSizing: "border-box" as const
            }}
          />
          <button
            type="submit"
            disabled={!code.trim() || loading || !!success}
            style={{
              width: "100%", padding: "14px 0", background: "#1a1a1a", color: "#e8e6e1", border: `1px solid ${gxBorder}`,
              fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer",
              opacity: (!code.trim() || loading || !!success) ? 0.4 : 1, fontFamily: "inherit"
            }}
          >
            {loading ? "MEMVALIDASI..." : success ? "BERHASIL" : "AKTIFKAN KODE"}
          </button>
          <p style={{ fontSize: 10, color: gxMuted, textAlign: "center" as const, marginTop: 12 }}>
            Setiap kode hanya berlaku 1x pakai. Hubungi admin jika belum punya kode.
          </p>
        </form>
      </div>
    </div>
  );
}
