"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const s = {
    serif: 'Georgia, "Times New Roman", serif',
    mono: '"SF Mono", "Fira Code", monospace',
    muted: "#7a7a72",
    text: "#e8e6e1",
    border: "rgba(255,255,255,0.08)",
    bg: "#0a0a0a",
  };

  if (hasAccess) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", paddingTop: 40 }}>
        <h1 style={{ fontFamily: s.serif, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 400, fontStyle: "italic", color: s.text, lineHeight: 1.15, marginBottom: 12 }}>
          Selamat Datang
        </h1>
        <p style={{ fontSize: 14, color: s.muted, lineHeight: 1.7, marginBottom: 48, maxWidth: 400 }}>
          Platform pemulihan akun media sosial dengan panduan langkah demi langkah.
        </p>

        <nav style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: `1px solid ${s.border}` }}>
          {[
            { label: "Mulai Pemulihan", desc: "Pilih platform dan ikuti panduan pemulihan akun", href: "/portal/troubleshoot" },
            { label: "Artikel", desc: "Tips dan panduan keamanan akun digital", href: "/portal/articles" },
            { label: "Dukungan", desc: "Hubungi tim support kami", href: "/portal/support" },
            { label: "Modul Belajar", desc: "Pelajari keamanan digital secara mandiri", href: "/portal/modules" },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ display: "flex", alignItems: "baseline", gap: 24, padding: "20px 0", borderBottom: `1px solid ${s.border}`, textDecoration: "none", transition: "opacity 0.2s" }}
            >
              <span style={{ fontFamily: s.mono, fontSize: 10, color: "rgba(122,122,114,0.4)", minWidth: 20 }}>0{i + 1}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: s.text, letterSpacing: "0.02em", marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: s.muted }}>{item.desc}</p>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 14, color: s.muted }}>→</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", paddingTop: 40 }}>
      <h1 style={{ fontFamily: s.serif, fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 400, fontStyle: "italic", color: s.text, lineHeight: 1.15, marginBottom: 12 }}>
        Pemulihan Akun
      </h1>
      <p style={{ fontSize: 14, color: s.muted, lineHeight: 1.7, marginBottom: 48, maxWidth: 360 }}>
        Masukkan kode akses untuk membuka panduan pemulihan premium.
      </p>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{error}</p>}
        {success && <p style={{ fontSize: 12, color: "#22c55e", marginBottom: 12 }}>{success}</p>}
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); if (error) setError(""); }}
          placeholder="MASUKKAN KODE"
          maxLength={20}
          autoComplete="off"
          disabled={loading || !!success}
          style={{
            width: "100%", padding: "14px 16px", background: "transparent", border: `1px solid ${s.border}`,
            color: s.text, fontSize: 13, letterSpacing: "0.1em", textAlign: "center" as const,
            fontFamily: s.mono, marginBottom: 12, outline: "none", boxSizing: "border-box" as const
          }}
        />
        <button
          type="submit"
          disabled={!code.trim() || loading || !!success}
          style={{
            width: "100%", padding: "14px 0", background: "#1a1a1a", color: s.text, border: `1px solid ${s.border}`,
            fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, cursor: "pointer",
            opacity: (!code.trim() || loading || !!success) ? 0.4 : 1, fontFamily: "inherit"
          }}
        >
          {loading ? "MEMVALIDASI..." : success ? "BERHASIL" : "AKTIFKAN KODE"}
        </button>
      </form>
    </div>
  );
}
