"use client";

import { createContext, useContext, useCallback, useMemo, useSyncExternalStore, type ReactNode } from "react";

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
    "access.active": "Akses premium Anda sudah aktif. Tidak perlu memasukkan kode lagi.",
    "access.openPortal": "Buka Panduan Pemulihan",

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

    /* ——— Portal ——— */
    "portal.welcome": "Selamat Datang",
    "portal.welcomeDesc": "Platform pemulihan akun media sosial dengan panduan langkah demi langkah.",
    "portal.startRecovery": "Mulai Pemulihan",
    "portal.startRecoveryDesc": "Pilih platform dan ikuti panduan pemulihan akun",
    "portal.articles": "Artikel",
    "portal.articlesDesc": "Tips dan panduan keamanan akun digital",
    "portal.support": "Dukungan",
    "portal.supportDesc": "Hubungi tim support kami",
    "portal.modules": "Modul Belajar",
    "portal.modulesDesc": "Pelajari keamanan digital secara mandiri",
    "portal.codeTitle": "Pemulihan Akun",
    "portal.codeDesc": "Masukkan kode akses untuk membuka panduan pemulihan premium.",
    "portal.codePlaceholder": "MASUKKAN KODE",
    "portal.codeSubmit": "AKTIFKAN KODE",
    "portal.codeValidating": "MEMVALIDASI...",
    "portal.codeSuccess": "BERHASIL",

    /* ——— Portal Nav ——— */
    "portal.nav.home": "Beranda",
    "portal.nav.recovery": "Pemulihan",
    "portal.nav.support": "Dukungan",
    "portal.nav.articles": "Artikel",
    "portal.nav.modules": "Modul",
    "portal.nav.signout": "Sign out",

    /* ——— Troubleshoot ——— */
    "troubleshoot.title": "Pemulihan Akun",
    "troubleshoot.subtitle": "Pilih platform, identifikasi kendala, dan ikuti panduan solusi.",
    "troubleshoot.step1of3": "LANGKAH 1 DARI 3",
    "troubleshoot.step2of3": "LANGKAH 2 DARI 3",
    "troubleshoot.step3of3": "LANGKAH 3 DARI 3",
    "troubleshoot.choosePlatform": "Pilih Platform",
    "troubleshoot.choosePlatformDesc": "Pilih akun media sosial yang perlu dipulihkan.",
    "troubleshoot.searchPlatform": "Cari platform...",
    "troubleshoot.select": "Pilih",
    "troubleshoot.notFound": "Tidak ditemukan",
    "troubleshoot.chooseIssue": "Pilih Masalah",
    "troubleshoot.chooseIssueDesc": "Pilih kendala yang Anda alami.",
    "troubleshoot.searchIssue": "Cari kendala...",
    "troubleshoot.solution": "Panduan Solusi",
    "troubleshoot.step": "Langkah",
    "troubleshoot.openAll": "Buka Semua",
    "troubleshoot.closeAll": "Tutup Semua",
    "troubleshoot.endGuide": "Akhir panduan",
    "troubleshoot.openNewTab": "Buka di tab baru",
    "troubleshoot.noSolution": "Belum ada solusi tersedia",
    "troubleshoot.noSolutionDesc": "Panduan untuk masalah ini sedang disiapkan.",
    "troubleshoot.solutionSubtitle": "Ikuti langkah berikut untuk menyelesaikan masalah Anda",
    "troubleshoot.text": "Teks",
    "troubleshoot.video": "Video",
    "troubleshoot.template": "Template",
    "troubleshoot.link": "Link",
    "troubleshoot.platform": "Platform",
    "troubleshoot.issue": "Masalah",
    "troubleshoot.back": "Kembali",
    "troubleshoot.reset": "Reset",
    "troubleshoot.loading": "Memuat solusi...",
    "troubleshoot.errorLoading": "Gagal memuat solusi",
    "troubleshoot.copied": "Tersalin",
    "troubleshoot.copy": "Salin",
    "troubleshoot.noIssue": "Belum ada masalah tersedia",
    "troubleshoot.solutionShort": "Solusi",
    "troubleshoot.errorLoadingIssues": "Gagal memuat daftar kendala",
    "troubleshoot.tryOtherKeyword": "Coba kata kunci lain.",

    /* ——— Support ——— */
    "support.title": "Support",
    "support.subtitle": "Hubungi tim kami untuk bantuan pemulihan akun.",
    "support.faq": "Pertanyaan umum",
    "support.contact": "Hubungi kami",
    "support.wa.desc": "Chat langsung dengan tim pemulihan",
    "support.tg.desc": "Bantuan cepat lewat Telegram",
    "support.web.desc": "Website resmi Mediea Solution",
    "support.faq1.q": "Berapa lama proses pemulihan?",
    "support.faq1.a": "Tergantung platform dan jenis kendala. Umumnya 1–7 hari kerja.",
    "support.faq2.q": "Apakah data saya aman?",
    "support.faq2.a": "Kami tidak pernah meminta password Anda. Semua panduan bersifat mandiri.",
    "support.faq3.q": "Bagaimana cara mendapatkan kode akses?",
    "support.faq3.a": "Melalui admin resmi kami via WhatsApp atau mitra affiliate.",
    "support.faq4.q": "Apakah ada jaminan berhasil?",
    "support.faq4.a": "Panduan mengikuti prosedur resmi tiap platform. Hasil akhir bergantung pada kondisi akun.",

    /* ——— Articles ——— */
    "articles.title": "Pusat Informasi",
    "articles.subtitle": "Artikel, panduan, dan layanan untuk pemulihan akun media sosial.",

    /* ——— Modules ——— */
    "modules.title": "Modul Belajar",
    "modules.subtitle": "Materi edukasi untuk keamanan akun digital.",
    "modules.comingSoon": "Segera Hadir",
    "modules.inDevelopment": "Modul sedang dalam pengembangan",
    "modules.comingSoonDesc": "Konten edukasi tentang keamanan digital, prosedur verifikasi, dan teknik pencegahan.",
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
    "access.active": "Your premium access is already active. No need to enter a code again.",
    "access.openPortal": "Open Recovery Guides",

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

    /* ——— Portal ——— */
    "portal.welcome": "Welcome",
    "portal.welcomeDesc": "Social media account recovery platform with step-by-step guides.",
    "portal.startRecovery": "Start Recovery",
    "portal.startRecoveryDesc": "Choose a platform and follow the account recovery guide",
    "portal.articles": "Articles",
    "portal.articlesDesc": "Tips and guides for digital account security",
    "portal.support": "Support",
    "portal.supportDesc": "Contact our support team",
    "portal.modules": "Learning Modules",
    "portal.modulesDesc": "Learn digital security independently",
    "portal.codeTitle": "Account Recovery",
    "portal.codeDesc": "Enter your access code to unlock premium recovery guides.",
    "portal.codePlaceholder": "ENTER CODE",
    "portal.codeSubmit": "ACTIVATE CODE",
    "portal.codeValidating": "VALIDATING...",
    "portal.codeSuccess": "SUCCESS",

    /* ——— Portal Nav ——— */
    "portal.nav.home": "Home",
    "portal.nav.recovery": "Recovery",
    "portal.nav.support": "Support",
    "portal.nav.articles": "Articles",
    "portal.nav.modules": "Modules",
    "portal.nav.signout": "Sign out",

    /* ——— Troubleshoot ——— */
    "troubleshoot.title": "Account Recovery",
    "troubleshoot.subtitle": "Choose a platform, identify the issue, and follow the solution guide.",
    "troubleshoot.step1of3": "STEP 1 OF 3",
    "troubleshoot.step2of3": "STEP 2 OF 3",
    "troubleshoot.step3of3": "STEP 3 OF 3",
    "troubleshoot.choosePlatform": "Choose Platform",
    "troubleshoot.choosePlatformDesc": "Select the social media account that needs recovery.",
    "troubleshoot.searchPlatform": "Search platform...",
    "troubleshoot.select": "Select",
    "troubleshoot.notFound": "Not found",
    "troubleshoot.chooseIssue": "Choose Issue",
    "troubleshoot.chooseIssueDesc": "Select the issue you are experiencing.",
    "troubleshoot.searchIssue": "Search issue...",
    "troubleshoot.solution": "Solution Guide",
    "troubleshoot.step": "Step",
    "troubleshoot.openAll": "Open All",
    "troubleshoot.closeAll": "Close All",
    "troubleshoot.endGuide": "End of guide",
    "troubleshoot.openNewTab": "Open in new tab",
    "troubleshoot.noSolution": "No solution available yet",
    "troubleshoot.noSolutionDesc": "The guide for this issue is being prepared.",
    "troubleshoot.solutionSubtitle": "Follow the steps below to resolve your issue",
    "troubleshoot.text": "Text",
    "troubleshoot.video": "Video",
    "troubleshoot.template": "Template",
    "troubleshoot.link": "Link",
    "troubleshoot.platform": "Platform",
    "troubleshoot.issue": "Issue",
    "troubleshoot.back": "Back",
    "troubleshoot.reset": "Reset",
    "troubleshoot.loading": "Loading solutions...",
    "troubleshoot.errorLoading": "Failed to load solutions",
    "troubleshoot.copied": "Copied",
    "troubleshoot.copy": "Copy",
    "troubleshoot.noIssue": "No issues available yet",
    "troubleshoot.solutionShort": "Solution",
    "troubleshoot.errorLoadingIssues": "Failed to load issues",
    "troubleshoot.tryOtherKeyword": "Try another keyword.",

    /* ——— Support ——— */
    "support.title": "Support",
    "support.subtitle": "Contact our team for account recovery assistance.",
    "support.faq": "Frequently asked",
    "support.contact": "Contact us",
    "support.wa.desc": "Chat directly with our recovery team",
    "support.tg.desc": "Quick help via Telegram",
    "support.web.desc": "Official Mediea Solution website",
    "support.faq1.q": "How long does recovery take?",
    "support.faq1.a": "It depends on the platform and issue. Usually 1–7 business days.",
    "support.faq2.q": "Is my data safe?",
    "support.faq2.a": "We never ask for your password. All guides are self-service.",
    "support.faq3.q": "How do I get an access code?",
    "support.faq3.a": "Through our official admin on WhatsApp or an affiliate partner.",
    "support.faq4.q": "Is success guaranteed?",
    "support.faq4.a": "Guides follow each platform's official procedures. Results depend on the account's condition.",

    /* ——— Articles ——— */
    "articles.title": "Information Center",
    "articles.subtitle": "Articles, guides, and services for social media account recovery.",

    /* ——— Modules ——— */
    "modules.title": "Learning Modules",
    "modules.subtitle": "Educational materials for digital account security.",
    "modules.comingSoon": "Coming Soon",
    "modules.inDevelopment": "Modules are in development",
    "modules.comingSoonDesc": "Educational content covering digital security, verification procedures, and prevention techniques.",
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

/* ——— Locale store (localStorage, shared by every provider instance) ——— */
const LANG_KEY = "mediea-lang";
const LANG_EVENT = "mediea-lang-change";

function readLocale(): Locale {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "en" ? "en" : "id";
  } catch {
    return "id";
  }
}

function subscribeLocale(onChange: () => void) {
  window.addEventListener(LANG_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LANG_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/* ——— Provider ——— */
export function I18nProvider({ children }: { children: ReactNode }) {
  // Server render & hydration use "id"; the saved choice applies right after
  const locale = useSyncExternalStore(subscribeLocale, readLocale, () => "id" as Locale);

  const setLocale = useCallback((newLocale: Locale) => {
    try {
      localStorage.setItem(LANG_KEY, newLocale);
    } catch {}
    window.dispatchEvent(new Event(LANG_EVENT));
  }, []);

  const t = useCallback(
    (key: string): string => dict[locale]?.[key] ?? dict["id"]?.[key] ?? key,
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/* ——— Hook ——— */
export function useI18n() {
  return useContext(I18nContext);
}
