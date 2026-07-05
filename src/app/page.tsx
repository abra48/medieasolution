import Link from "next/link";
import { LandingAccessCodeForm } from "./landing-access-code-form";

const PLATFORMS = [
  { name: "Facebook", color: "#1877F2" },
  { name: "Instagram", color: "#E4405F" },
  { name: "TikTok", color: "#00F2EA" },
  { name: "Twitter / X", color: "#A0A0A0" },
  { name: "YouTube", color: "#FF0000" },
  { name: "WhatsApp", color: "#25D366" },
  { name: "Telegram", color: "#26A5E4" },
  { name: "LinkedIn", color: "#0A66C2" },
];

const STEPS = [
  {
    number: "01",
    title: "Masukkan Kode Akses",
    description: "Gunakan kode unik untuk membuka platform pemulihan.",
  },
  {
    number: "02",
    title: "Pilih Platform",
    description: "Pilih akun media sosial yang perlu dipulihkan.",
  },
  {
    number: "03",
    title: "Identifikasi Masalah",
    description: "Pilih kendala spesifik — diblokir, diretas, atau terkunci.",
  },
  {
    number: "04",
    title: "Ikuti Panduan",
    description: "Langkah demi langkah dengan template dan tautan langsung.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ——— Nav ——— */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-accent text-xs font-semibold">M</span>
            </div>
            <span className="text-sm font-semibold text-text-primary tracking-tight">
              Mediea<span className="text-accent">Solution</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hidden sm:block text-sm text-text-tertiary hover:text-text-secondary transition-colors">
              Cara Kerja
            </a>
            <Link href="/login" className="text-sm text-text-tertiary hover:text-text-secondary transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="btn-primary !py-1.5 !px-4 !text-xs">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* ——— Hero ——— */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-medium text-accent tracking-widest uppercase mb-6">
            Platform Pemulihan Akun
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-text-primary mb-5">
            Pulihkan akun media sosial Anda
          </h1>

          <p className="max-w-xl mx-auto text-base text-text-secondary leading-relaxed mb-10">
            Panduan langkah demi langkah untuk akun yang diblokir, diretas,
            dan terkunci di semua platform utama.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <a href="#access" className="btn-primary px-6 py-2.5 text-sm">
              Mulai Pemulihan
            </a>
            <a href="#how-it-works" className="btn-secondary px-6 py-2.5 text-sm">
              Cara Kerja
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 max-w-md mx-auto">
            {[
              { value: "8+", label: "Platform" },
              { value: "50+", label: "Kendala" },
              { value: "200+", label: "Solusi" },
              { value: "99%", label: "Sukses" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-text-primary">{stat.value}</div>
                <div className="text-xs text-text-tertiary mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Platforms ——— */}
      <section className="py-20 px-6 border-t border-border-default">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-medium text-text-tertiary tracking-widest uppercase mb-8 text-center">
            Platform yang Didukung
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PLATFORMS.map((platform) => (
              <Link
                key={platform.name}
                href="/portal"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border-default bg-bg-secondary hover:border-accent/40 hover:bg-accent/5 transition-all group"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="text-sm text-text-primary group-hover:text-accent transition-colors">{platform.name}</span>
              </Link>
            ))}
          </div>
          <p className="text-xs text-text-tertiary text-center mt-4">
            Klik platform untuk melihat kendala dan solusi pemulihan
          </p>
        </div>
      </section>

      {/* ——— How It Works ——— */}
      <section id="how-it-works" className="py-20 px-6 border-t border-border-default bg-bg-secondary/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Cara kerjanya
            </h2>
            <p className="text-sm text-text-secondary">
              Empat langkah untuk memulihkan akun Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="card">
                  <span className="text-xs font-mono text-accent mb-3 block">
                    {step.number}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Features ——— */}
      <section className="py-20 px-6 border-t border-border-default">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Mengapa Mediea Solution
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Dipandu Ahli", desc: "Solusi dibuat oleh profesional keamanan media sosial." },
              { title: "Multi-Platform", desc: "Mencakup Facebook, Instagram, TikTok, YouTube, dan lainnya." },
              { title: "Akses Instan", desc: "Tanpa menunggu — dapatkan akses langsung dengan kode Anda." },
              { title: "Template Siap Pakai", desc: "Template banding dan tautan langsung untuk menghemat waktu." },
              { title: "Tutorial Video", desc: "Panduan visual untuk prosedur pemulihan yang kompleks." },
              { title: "Privat & Aman", desc: "Kami tidak pernah meminta password atau kredensial Anda." },
            ].map((feature) => (
              <div key={feature.title} className="card group">
                <h3 className="text-sm font-semibold text-text-primary mb-1.5 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-tertiary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Access Code ——— */}
      <section id="access" className="py-20 px-6 border-t border-border-default bg-bg-secondary/40">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-medium text-secondary tracking-widest uppercase mb-4">
            Akses Premium
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            Masukkan kode akses Anda
          </h2>
          <p className="text-sm text-text-secondary mb-8">
            Gunakan kode unik untuk membuka platform pemulihan lengkap.
          </p>

          <LandingAccessCodeForm />

          <p className="text-xs text-text-tertiary mt-6">
            Belum punya kode?{" "}
            <Link href="/portal/support" className="text-accent hover:underline">
              Hubungi kami
            </Link>{" "}
            untuk mendapatkannya.
          </p>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="border-t border-border-default">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-accent text-[10px] font-semibold">M</span>
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Mediea<span className="text-accent">Solution</span>
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} Mediea Solution. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

