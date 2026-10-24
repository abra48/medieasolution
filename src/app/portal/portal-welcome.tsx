"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconGrid,
  IconBook,
  IconDocument,
  IconVideo,
  IconShieldCheck,
  IconArticle,
  IconChat,
  IconGraduation,
  IconBolt,
  IconCheckCircle,
  IconChevronRight,
  IconLock,
  IconAlertCircle,
  IconSpinner,
  IconKey,
  IconCompass,
  IconWrench,
  IconVerified,
} from "@/components/icons";

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

  // User already has access — Premium Dashboard
  if (hasAccess) {
    return (
      <div className="max-w-3xl mx-auto py-4 animate-fade-in">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Premium Aktif</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Selamat Datang di Mediea Solution
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Platform pemulihan akun media sosial dengan panduan langkah demi langkah.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Platform", value: "8+", icon: IconGrid, color: "#10b981" },
            { label: "Solusi", value: "200+", icon: IconBook, color: "#3b82f6" },
            { label: "Template", value: "50+", icon: IconDocument, color: "#f59e0b" },
            { label: "Video", value: "30+", icon: IconVideo, color: "#ef4444" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="dash-stat">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                  >
                    <Icon className="w-4 h-4" color={stat.color} />
                  </div>
                </div>
                <p className="text-xl font-bold text-text-primary" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
            Aksi Cepat
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href="/portal/troubleshoot" className="quick-action group">
              <div className="quick-action-icon bg-accent/10 text-accent">
                <IconShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">Mulai Pemulihan Akun</p>
                <p className="text-xs text-text-tertiary">Pilih platform dan ikuti panduan</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link href="/portal/articles" className="quick-action group">
              <div className="quick-action-icon bg-info/10 text-info">
                <IconArticle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">Baca Artikel</p>
                <p className="text-xs text-text-tertiary">Tips keamanan akun digital</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link href="/portal/support" className="quick-action group">
              <div className="quick-action-icon bg-warning/10 text-warning">
                <IconChat className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">Hubungi Support</p>
                <p className="text-xs text-text-tertiary">Butuh bantuan? Chat kami</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link href="/portal/modules" className="quick-action group">
              <div className="quick-action-icon bg-secondary/10 text-secondary">
                <IconGraduation className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">Learning Modules</p>
                <p className="text-xs text-text-tertiary">Pelajari keamanan digital</p>
              </div>
              <IconChevronRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="p-5 rounded-xl border border-accent/20 bg-accent/[0.03]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <IconVerified className="w-[18px] h-[18px] text-accent" />
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
            <IconBolt className="w-4 h-4" />
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
                <IconAlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent/5 border border-accent/15 text-sm text-accent font-medium">
                <IconSpinner className="w-4 h-4 shrink-0" />
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
                  <IconSpinner className="w-4 h-4" />
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
    { num: "1", title: "Masukkan Kode", desc: "Gunakan kode unik dari admin", icon: IconKey },
    { num: "2", title: "Pilih Platform", desc: "Facebook, Instagram, TikTok, dll", icon: IconCompass },
    { num: "3", title: "Pilih Kendala", desc: "Diretas, diblokir, atau terkunci", icon: IconWrench },
    { num: "4", title: "Ikuti Solusi", desc: "Panduan + template siap pakai", icon: IconCheckCircle },
  ];

  return (
    <div>
      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
        Cara Kerja
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="p-3.5 rounded-xl border border-border-subtle bg-bg-secondary/60">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-md bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center">
                  {s.num}
                </span>
                <span className="text-xs font-semibold text-text-primary">{s.title}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Icon className="w-3 h-3 text-text-tertiary" />
                <p className="text-[11px] text-text-tertiary leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
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
          <IconLock className="w-8 h-8 text-text-tertiary mx-auto mb-1.5 opacity-40" />
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
