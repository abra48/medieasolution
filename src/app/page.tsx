import Link from "next/link";
import { LandingAccessCodeForm } from "./landing-access-code-form";
import { LandingAnimations } from "./landing-animations";
import { ThemeToggle } from "./theme-toggle";

/* ——— Data ——— */

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

const FEATURES = [
  {
    title: "Dipandu Ahli",
    desc: "Solusi dibuat oleh profesional keamanan media sosial.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
  },
  {
    title: "Multi-Platform",
    desc: "Mencakup Facebook, Instagram, TikTok, YouTube, dan lainnya.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Akses Instan",
    desc: "Tanpa menunggu — dapatkan akses langsung dengan kode Anda.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Template Siap Pakai",
    desc: "Template banding dan tautan langsung untuk menghemat waktu.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    title: "Tutorial Video",
    desc: "Panduan visual untuk prosedur pemulihan yang kompleks.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </svg>
    ),
  },
  {
    title: "Privat & Aman",
    desc: "Kami tidak pernah meminta password atau kredensial Anda.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

/* ——— Helper: wrap each word for text reveal animation ——— */
function RevealText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span data-text-reveal className={className}>
      {words.map((word, i) => (
        <span key={i} className="word">
          <span className="word-inner">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ================================================================
   LANDING PAGE
   ================================================================ */

export default function Home() {
  return (
    <div className="landing min-h-screen">
      <LandingAnimations />

      {/* ——— Nav ——— */}
      <nav className="fixed top-0 left-0 right-0 z-50 landing-nav" data-landing-nav>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <img src="https://i.ibb.co.com/qY3R33DK/Gemini-Generated-Image-xmtysbxmtysbxmty.png" alt="Mediea Solution" className="w-8 h-8 rounded-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <span className="text-sm font-semibold tracking-tight l-text nav-logo-text">
              Mediea<span className="landing-gradient-text">Solution</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <a href="#how-it-works" className="hidden sm:block text-sm landing-link-muted">
              Cara Kerja
            </a>
            <Link href="/login" className="hidden sm:block text-sm landing-link-muted">
              Masuk
            </Link>
            <ThemeToggle />
            <Link href="/register" className="landing-btn !py-2 !px-4 sm:!px-5 !text-xs">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* ——— Hero ——— */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Particles canvas */}
          <canvas id="particles-canvas" className="particles-canvas" />
          {/* Gradient glow */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full hero-glow"
            data-parallax="0.15"
          />
          {/* Floating blobs */}
          <div className="absolute top-[20%] right-[15%] w-[200px] h-[200px] rounded-full blob-animate opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }}
          />
          <div className="absolute bottom-[30%] left-[10%] w-[150px] h-[150px] rounded-full blob-animate-delayed opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }}
          />
          {/* Bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-px hero-bottom-line" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center pt-16 sm:pt-0">
          {/* Badge */}
          <div className="hero-animate hero-animate-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 sm:mb-8 landing-badge">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] dot-pulse" />
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em] l-text-accent">
              Platform Pemulihan Akun
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-animate hero-animate-2 hero-title text-3xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-bold leading-[1.08] tracking-tight mb-5 sm:mb-6 l-text">
            <RevealText text="Pulihkan akun media sosial Anda" />
          </h1>

          {/* Subtitle */}
          <p className="hero-animate hero-animate-3 hero-subtitle max-w-lg mx-auto text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 l-text-secondary">
            Panduan langkah demi langkah untuk akun yang diblokir, diretas, dan terkunci di semua platform utama.
          </p>

          {/* CTAs */}
          <div className="hero-animate hero-animate-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <a href="#access" className="landing-btn w-full sm:w-auto">
              Mulai Pemulihan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </a>
            <a href="#how-it-works" className="landing-btn-outline w-full sm:w-auto">
              Cara Kerja
            </a>
          </div>

          {/* Stats */}
          <div className="hero-animate hero-animate-5 stats-grid grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-sm sm:max-w-md mx-auto">
            {[
              { value: "8+", label: "Platform" },
              { value: "50+", label: "Kendala" },
              { value: "200+", label: "Solusi" },
              { value: "99%", label: "Sukses" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold l-text">{stat.value}</div>
                <div className="text-[10px] sm:text-[11px] mt-1 uppercase tracking-wider l-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 scroll-indicator hidden sm:block" data-scroll-indicator>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] l-text-muted">Scroll</span>
            <svg className="w-4 h-4 l-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ——— Platforms Marquee ——— */}
      <section className="py-8 sm:py-12 border-t border-b l-border-light overflow-hidden">
        <div data-reveal="fade" data-reveal-delay="0">
          <p className="text-center text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-6 sm:mb-8 l-text-muted">
            Platform yang Didukung
          </p>
          <div className="relative overflow-hidden">
            <div className="marquee-track">
              {[...PLATFORMS, ...PLATFORMS].map((platform, i) => (
                <div key={`${platform.name}-${i}`} className="flex items-center gap-3 px-5 sm:px-8">
                  <div
                    className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="marquee-name text-base sm:text-xl font-light whitespace-nowrap l-text">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— How It Works ——— */}
      <section id="how-it-works" className="py-16 sm:py-24 md:py-32 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <p className="text-[11px] uppercase tracking-[0.2em] mb-4 l-text-accent">
              Proses
            </p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight l-text">
              Cara kerjanya
            </h2>
            <p className="max-w-md mx-auto mt-4 text-sm sm:text-base l-text-secondary">
              Empat langkah sederhana untuk memulihkan akun Anda.
            </p>
          </div>

          <div className="steps-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {STEPS.map((step, i) => (
              <div key={step.number} data-reveal data-reveal-delay={String(i * 100)}>
                <div className="relative hover-lift p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="step-number text-[40px] font-bold leading-none">
                      {step.number}
                    </span>
                    <div className="step-line flex-1 h-px" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold mb-2 l-text">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed l-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="landing-divider max-w-5xl mx-auto" />

      {/* ——— Features ——— */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <p className="text-[11px] uppercase tracking-[0.2em] mb-4 l-text-accent">
              Keunggulan
            </p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight l-text">
              Mengapa Mediea Solution
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((feature, i) => (
              <div key={feature.title} data-reveal data-reveal-delay={String(i * 80)}>
                <div className="landing-card group cursor-default">
                  <div className="landing-icon-box w-10 h-10 rounded-xl flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold mb-2 l-text transition-colors duration-300 group-hover:!text-[#10b981]">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed l-text-secondary">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="landing-divider max-w-5xl mx-auto" />

      {/* ——— Access Code ——— */}
      <section id="access" className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 access-section-bg">
        <div className="max-w-md mx-auto text-center" data-reveal>
          <div className="landing-icon-box w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>

          <p className="text-[11px] uppercase tracking-[0.2em] mb-3 l-text-accent">
            Akses Premium
          </p>
          <h2 className="section-title text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3 l-text">
            Masukkan kode akses Anda
          </h2>
          <p className="text-sm mb-8 l-text-secondary">
            Gunakan kode unik untuk membuka platform pemulihan lengkap.
          </p>

          {/* Access code form — uses CSS class-based overrides */}
          <div className="landing-form-wrapper">
            <LandingAccessCodeForm />
          </div>

          <p className="text-xs mt-6 l-text-muted">
            Belum punya kode?{" "}
            <Link href="/portal/support" className="l-text-accent transition-colors duration-300 hover:underline">
              Hubungi kami
            </Link>{" "}
            untuk mendapatkannya.
          </p>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="landing-footer">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <div className="footer-grid grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12" data-reveal>
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <span className="text-sm font-semibold tracking-tight l-text">
                  Mediea<span className="landing-gradient-text">Solution</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed l-text-secondary">
                Platform pemulihan akun media sosial terlengkap dengan panduan langkah demi langkah.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 l-text-muted">
                Navigasi
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Cara Kerja", href: "#how-it-works" },
                  { label: "Masuk", href: "/login" },
                  { label: "Daftar", href: "/register" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-sm landing-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 l-text-muted">
                Kontak
              </h4>
              <div className="space-y-3">
                <a
                  href="https://wa.me/6281241511156"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm landing-link"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  081241511156
                </a>
                <a
                  href="https://mediea.co.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm landing-link"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  mediea.co.id
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 sm:mt-12 pt-6 landing-footer-divider">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs l-text-muted">
                © {new Date().getFullYear()} Mediea Solution. All rights reserved.
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] dot-pulse" />
                <span className="text-[10px] uppercase tracking-[0.15em] l-text-muted">
                  Sistem Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
