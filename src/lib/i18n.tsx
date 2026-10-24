"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/* ——— Types ——— */
export type Locale = "id" | "en";

type Translations = Record<string, string>;

/* ——— Dictionary ——— */
const dict: Record<Locale, Translations> = {
  id: {
    "nav.howItWorks": "Cara Kerja",
    "nav.login": "Masuk",
    "nav.register": "Daftar",
    "nav.testimonials": "Testimoni",

    "hero.badge": "Platform Pemulihan #1 di Indonesia",
    "hero.title1": "Pulihkan akun ",
    "hero.titleHighlight": "media sosial",
    "hero.title2": " Anda",
    "hero.subtitle": "Panduan langkah demi langkah untuk akun yang diblokir, diretas, dan terkunci di semua platform utama.",
    "hero.cta": "Mulai Pemulihan Sekarang",
    "hero.secondary": "Pelajari Cara Kerja",
    "hero.stats": "Mendukung 8+ platform · 200+ solusi tersedia",
    "hero.usersHelped": "pengguna terbantu",

    "platforms.label": "Platform yang Didukung",

    "howItWorks.sectionLabel": "Proses",
    "howItWorks.title": "Cara kerjanya",
    "howItWorks.subtitle": "Empat langkah sederhana untuk memulihkan akun Anda.",
    "step1.title": "Masukkan Kode Akses",
    "step1.desc": "Gunakan kode unik untuk membuka platform pemulihan.",
    "step2.title": "Pilih Platform",
    "step2.desc": "Pilih akun media sosial yang perlu dipulihkan.",
    "step3.title": "Identifikasi Masalah",
    "step3.desc": "Pilih kendala spesifik yang Anda alami.",
    "step4.title": "Ikuti Panduan",
    "step4.desc": "Langkah demi langkah dengan template dan tautan langsung.",

    "why.sectionLabel": "Keunggulan",
    "why.title": "Mengapa Mediea Solution",
    "feature1.title": "Dipandu Ahli",
    "feature1.desc": "Solusi dibuat oleh profesional keamanan media sosial.",
    "feature2.title": "Multi-Platform",
    "feature2.desc": "Mencakup Facebook, Instagram, TikTok, YouTube, dan lainnya.",
    "feature3.title": "Akses Instan",
    "feature3.desc": "Tanpa menunggu — dapatkan akses langsung dengan kode Anda.",
    "feature4.title": "Template Siap Pakai",
    "feature4.desc": "Template banding dan tautan langsung untuk menghemat waktu.",
    "feature5.title": "Tutorial Video",
    "feature5.desc": "Panduan visual untuk prosedur pemulihan yang kompleks.",
    "feature6.title": "Privat & Aman",
    "feature6.desc": "Kami tidak pernah meminta password atau kredensial Anda.",

    "stats.recovered": "Akun Dipulihkan",
    "stats.platforms": "Platform Didukung",
    "stats.solutions": "Solusi Tersedia",
    "stats.successRate": "Tingkat Keberhasilan",

    "testimonials.sectionLabel": "Testimoni",
    "testimonials.title": "Dipercaya oleh ratusan pengguna",
    "testimonials.subtitle": "Apa kata mereka yang sudah berhasil memulihkan akun.",
    "testimonial1.name": "Ahmad R.",
    "testimonial1.role": "Pemilik UMKM",
    "testimonial1.text": "Akun Instagram bisnis saya kena hack, dalam 2 hari sudah bisa pulih berkat panduan di sini. Luar biasa!",
    "testimonial2.name": "Siti N.",
    "testimonial2.role": "Content Creator",
    "testimonial2.text": "TikTok saya diblokir tanpa alasan jelas. Template banding dari Mediea Solution sangat membantu, akun aktif lagi.",
    "testimonial3.name": "Budi S.",
    "testimonial3.role": "Digital Marketer",
    "testimonial3.text": "Sudah coba pulihkan Facebook Page sendirian, gagal terus. Pakai panduan ini, langkah-langkahnya jelas dan berhasil!",
    "testimonial4.name": "Dewi L.",
    "testimonial4.role": "Influencer",
    "testimonial4.text": "YouTube channel saya kena terminate, sangat panik. Panduan di sini detail banget, channel berhasil dipulihkan.",
    "testimonial5.name": "Reza P.",
    "testimonial5.role": "Freelancer",
    "testimonial5.text": "LinkedIn saya restricted secara tiba-tiba. Berkat template dari Mediea Solution, akun aktif dalam 3 hari.",
    "testimonial6.name": "Maya K.",
    "testimonial6.role": "Online Seller",
    "testimonial6.text": "WhatsApp bisnis saya kena ban. Panduannya mudah diikuti dan akun saya bisa dipakai kembali. Terima kasih!",

    "faq.label": "FAQ",
    "faq.title": "Pertanyaan yang sering ditanyakan",
    "faq1.q": "Apa itu Mediea Solution?",
    "faq1.a": "Mediea Solution adalah platform panduan pemulihan akun media sosial. Kami menyediakan langkah-langkah detail untuk memulihkan akun yang diblokir, diretas, atau terkunci di berbagai platform.",
    "faq2.q": "Apakah saya perlu keahlian teknis?",
    "faq2.a": "Tidak. Panduan kami dirancang untuk semua level pengguna. Setiap langkah dijelaskan secara detail dengan screenshot dan template siap pakai.",
    "faq3.q": "Platform apa saja yang didukung?",
    "faq3.a": "Kami mendukung Facebook, Instagram, TikTok, Twitter/X, YouTube, WhatsApp, Telegram, LinkedIn, dan terus bertambah.",
    "faq4.q": "Bagaimana cara mendapatkan kode akses?",
    "faq4.a": "Anda bisa mendapatkan kode akses melalui kontak kami. Hubungi via WhatsApp atau kunjungi website mediea.co.id untuk informasi lebih lanjut.",
    "faq5.q": "Apakah data saya aman?",
    "faq5.a": "Ya, keamanan data Anda adalah prioritas kami. Kami tidak pernah meminta password atau kredensial akun Anda. Semua panduan bersifat self-service.",

    "access.sectionLabel": "Akses Premium",
    "access.title": "Masukkan kode akses Anda",
    "access.subtitle": "Gunakan kode unik untuk membuka platform pemulihan lengkap.",
    "access.checking": "Memeriksa sesi...",
    "access.placeholder": "MASUKKAN KODE ANDA",
    "access.submit": "Buka Akses",
    "access.validating": "Memvalidasi...",
    "access.success": "Berhasil! Mengalihkan...",
    "access.loginRequired": "Anda harus login terlebih dahulu untuk menggunakan kode akses.",
    "access.loginBtn": "Masuk",
    "access.createAccountBtn": "Buat Akun",
    "access.wa": "Hubungi Admin untuk Kode Akses",
    "access.noCode": "Belum punya kode?",
    "access.contact": "Hubungi kami",
    "access.noCodeSuffix": "untuk mendapatkannya.",
    "access.errorInvalid": "Kode akses tidak valid.",
    "access.waMessage": "Halo Admin, saya ingin mendapatkan kode akses MedieaSolution",

    "footer.tagline": "Platform pemulihan akun media sosial terlengkap dengan panduan langkah demi langkah.",
    "footer.nav": "Navigasi",
    "footer.contact": "Kontak",
    "footer.howItWorks": "Cara Kerja",
    "footer.testimonials": "Testimoni",
    "footer.login": "Masuk",
    "footer.register": "Daftar",
    "footer.systemActive": "Sistem Aktif",

    "login.title": "Masuk",
    "login.subtitle": "Akses dashboard pemulihan Anda",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Masuk",
    "login.submitting": "Masuk...",
    "login.or": "atau",
    "login.noAccount": "Belum punya akun?",
    "login.createAccount": "Buat akun",
    "login.back": "← Kembali ke beranda",
    "login.failed": "Login gagal",

    "register.title": "Buat akun",
    "register.subtitle": "Mulai dengan Mediea Solution",
    "register.email": "Email",
    "register.password": "Password",
    "register.confirmPassword": "Konfirmasi Password",
    "register.submit": "Buat Akun",
    "register.submitting": "Membuat akun...",
    "register.or": "atau",
    "register.hasAccount": "Sudah punya akun?",
    "register.login": "Masuk",
    "register.back": "← Kembali ke beranda",
    "register.passwordMismatch": "Password tidak cocok.",
    "register.passwordPlaceholder": "Minimal 8 karakter",
    "register.confirmPasswordPlaceholder": "Ulangi password",
    "register.failed": "Registrasi gagal",

    "common.supabaseNotConfigured": "Supabase belum dikonfigurasi. Tambahkan kredensial di .env.local",

    "theme.light": "Mode terang",
    "theme.dark": "Mode gelap",

    "seo.title": "Mediea Solution — Pemulihan Akun Media Sosial",
    "seo.description": "Pulihkan akun media sosial yang diblokir, diretas, dan terkunci dengan panduan langkah demi langkah.",
  },
  en: {
    "nav.howItWorks": "How It Works",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.testimonials": "Testimonials",

    "hero.badge": "#1 Recovery Platform in Indonesia",
    "hero.title1": "Recover your ",
    "hero.titleHighlight": "social media",
    "hero.title2": " accounts",
    "hero.subtitle": "Step-by-step guides for blocked, hacked, and locked accounts on all major platforms.",
    "hero.cta": "Start Recovery Now",
    "hero.secondary": "Learn How It Works",
    "hero.stats": "Supporting 8+ platforms · 200+ solutions available",
    "hero.usersHelped": "users helped",

    "platforms.label": "Supported Platforms",

    "howItWorks.sectionLabel": "Process",
    "howItWorks.title": "How it works",
    "howItWorks.subtitle": "Four simple steps to recover your account.",
    "step1.title": "Enter Access Code",
    "step1.desc": "Use your unique code to unlock the recovery platform.",
    "step2.title": "Choose Platform",
    "step2.desc": "Select the social media account you need to recover.",
    "step3.title": "Identify the Problem",
    "step3.desc": "Select the specific issue you are experiencing.",
    "step4.title": "Follow the Guide",
    "step4.desc": "Step by step with templates and direct links.",

    "why.sectionLabel": "Advantages",
    "why.title": "Why Mediea Solution",
    "feature1.title": "Expert-Guided",
    "feature1.desc": "Solutions created by social media security professionals.",
    "feature2.title": "Multi-Platform",
    "feature2.desc": "Covers Facebook, Instagram, TikTok, YouTube, and more.",
    "feature3.title": "Instant Access",
    "feature3.desc": "No waiting — get instant access with your code.",
    "feature4.title": "Ready-Made Templates",
    "feature4.desc": "Appeal templates and direct links to save time.",
    "feature5.title": "Video Tutorials",
    "feature5.desc": "Visual guides for complex recovery procedures.",
    "feature6.title": "Private & Secure",
    "feature6.desc": "We never ask for your password or credentials.",

    "stats.recovered": "Accounts Recovered",
    "stats.platforms": "Platforms Supported",
    "stats.solutions": "Solutions Available",
    "stats.successRate": "Success Rate",

    "testimonials.sectionLabel": "Testimonials",
    "testimonials.title": "Trusted by hundreds of users",
    "testimonials.subtitle": "What they say after successfully recovering their accounts.",
    "testimonial1.name": "Ahmad R.",
    "testimonial1.role": "SME Owner",
    "testimonial1.text": "My business Instagram was hacked, recovered in 2 days thanks to the guides here. Amazing!",
    "testimonial2.name": "Siti N.",
    "testimonial2.role": "Content Creator",
    "testimonial2.text": "My TikTok was blocked without clear reason. The appeal template from Mediea Solution really helped, account is active again.",
    "testimonial3.name": "Budi S.",
    "testimonial3.role": "Digital Marketer",
    "testimonial3.text": "Tried recovering my Facebook Page alone, kept failing. With this guide, the steps were clear and it worked!",
    "testimonial4.name": "Dewi L.",
    "testimonial4.role": "Influencer",
    "testimonial4.text": "My YouTube channel got terminated, I was panicking. The guide here was super detailed, channel successfully recovered.",
    "testimonial5.name": "Reza P.",
    "testimonial5.role": "Freelancer",
    "testimonial5.text": "My LinkedIn was suddenly restricted. Thanks to templates from Mediea Solution, account active in 3 days.",
    "testimonial6.name": "Maya K.",
    "testimonial6.role": "Online Seller",
    "testimonial6.text": "My business WhatsApp got banned. The guide was easy to follow and my account is usable again. Thank you!",

    "faq.label": "FAQ",
    "faq.title": "Frequently asked questions",
    "faq1.q": "What is Mediea Solution?",
    "faq1.a": "Mediea Solution is a social media account recovery guide platform. We provide detailed steps to recover blocked, hacked, or locked accounts across various platforms.",
    "faq2.q": "Do I need technical expertise?",
    "faq2.a": "No. Our guides are designed for all user levels. Each step is explained in detail with screenshots and ready-to-use templates.",
    "faq3.q": "Which platforms are supported?",
    "faq3.a": "We support Facebook, Instagram, TikTok, Twitter/X, YouTube, WhatsApp, Telegram, LinkedIn, and more.",
    "faq4.q": "How do I get an access code?",
    "faq4.a": "You can get an access code through our contact. Reach out via WhatsApp or visit mediea.co.id for more information.",
    "faq5.q": "Is my data safe?",
    "faq5.a": "Yes, your data security is our priority. We never ask for your account password or credentials. All guides are self-service.",

    "access.sectionLabel": "Premium Access",
    "access.title": "Enter your access code",
    "access.subtitle": "Use your unique code to unlock the full recovery platform.",
    "access.checking": "Checking session...",
    "access.placeholder": "ENTER YOUR CODE",
    "access.submit": "Unlock Access",
    "access.validating": "Validating...",
    "access.success": "Success! Redirecting...",
    "access.loginRequired": "You must log in first to use the access code.",
    "access.loginBtn": "Login",
    "access.createAccountBtn": "Create Account",
    "access.wa": "Contact Admin for Access Code",
    "access.noCode": "Don't have a code?",
    "access.contact": "Contact us",
    "access.noCodeSuffix": "to get one.",
    "access.errorInvalid": "Invalid access code.",
    "access.waMessage": "Hello Admin, I would like to get an access code for MedieaSolution",

    "footer.tagline": "The most complete social media account recovery platform with step-by-step guides.",
    "footer.nav": "Navigation",
    "footer.contact": "Contact",
    "footer.howItWorks": "How It Works",
    "footer.testimonials": "Testimonials",
    "footer.login": "Login",
    "footer.register": "Register",
    "footer.systemActive": "System Active",

    "login.title": "Login",
    "login.subtitle": "Access your recovery dashboard",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Sign In",
    "login.submitting": "Signing in...",
    "login.or": "or",
    "login.noAccount": "Don't have an account?",
    "login.createAccount": "Create one",
    "login.back": "← Back to homepage",
    "login.failed": "Login failed",

    "register.title": "Create account",
    "register.subtitle": "Get started with Mediea Solution",
    "register.email": "Email",
    "register.password": "Password",
    "register.confirmPassword": "Confirm Password",
    "register.submit": "Create Account",
    "register.submitting": "Creating account...",
    "register.or": "or",
    "register.hasAccount": "Already have an account?",
    "register.login": "Sign in",
    "register.back": "← Back to homepage",
    "register.passwordMismatch": "Passwords do not match.",
    "register.passwordPlaceholder": "Minimum 8 characters",
    "register.confirmPasswordPlaceholder": "Repeat password",
    "register.failed": "Registration failed",

    "common.supabaseNotConfigured": "Supabase is not configured yet. Add credentials in .env.local",

    "theme.light": "Light mode",
    "theme.dark": "Dark mode",

    "seo.title": "Mediea Solution — Social Media Account Recovery",
    "seo.description": "Recover blocked, hacked, and locked-out social media accounts with step-by-step guided solutions.",
  },
};

/* ——— Context ——— */
interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "id",
  setLocale: () => {},
  t: (key) => key,
});

/* ——— Provider ——— */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mediea-lang") as Locale | null;
    if (saved && (saved === "id" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("mediea-lang", newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return dict[locale]?.[key] ?? dict["id"]?.[key] ?? key;
    },
    [locale]
  );

  // During SSR / before mount, still provide defaults
  if (!mounted) {
    return (
      <I18nContext.Provider value={{ locale: "id", setLocale, t: (key) => dict["id"]?.[key] ?? key }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/* ——— Hook ——— */
export function useI18n() {
  return useContext(I18nContext);
}
