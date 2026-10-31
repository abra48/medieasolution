"use client";

import Link from "next/link";
import { LandingAccessCodeForm } from "./landing-access-code-form";
import { LandingAnimations, AnimatedCounter } from "./landing-animations";
import { ThemeToggle } from "./theme-toggle";
import { FAQSection } from "./faq-section";
import { LanguageSwitcher } from "./language-switcher";
import { I18nProvider, useI18n } from "@/lib/i18n";

/* ——— Platform Icons (static, no text) ——— */
const PLATFORM_ICONS = [
  {
    name: "Facebook",
    color: "#1877F2",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    color: "#E4405F",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#E4405F">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    color: "#00F2EA",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    color: "#A0A0A0",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    color: "#FF0000",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    color: "#25D366",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    color: "#26A5E4",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#26A5E4">
        <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0 12 12 0 0011.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    color: "#0A66C2",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

/* ——— Marquee Keywords ——— */
const MARQUEE_KEYWORDS = [
  { text: "ACCOUNT RECOVERY", separator: "×" },
  { text: "MULTI-PLATFORM", separator: "→" },
  { text: "EXPERT GUIDES", separator: "→" },
  { text: "TEMPLATE READY", separator: "★" },
  { text: "INSTANT ACCESS", separator: "×" },
  { text: "SOCIAL MEDIA", separator: "→" },
  { text: "STEP BY STEP", separator: "×" },
  { text: "SECURE & PRIVATE", separator: "→" },
];

/* ——— Stat Data ——— */
const STAT_DATA = [
  { target: 500, suffix: "+", labelKey: "stats.recovered" },
  { target: 8, suffix: "+", labelKey: "stats.platforms" },
  { target: 200, suffix: "+", labelKey: "stats.solutions" },
  { target: 99, suffix: "%", labelKey: "stats.successRate" },
];

/* ——— Feature/Service Data ——— */
const SERVICE_TAGS_KEYS = [
  ["feature1.title", "feature2.title"],
  ["feature3.title", "feature4.title"],
  ["feature5.title", "feature6.title"],
];

const SERVICE_DESC_KEYS = [
  "feature1.desc",
  "feature3.desc",
  "feature5.desc",
];

const SERVICE_TITLE_KEYS = [
  "feature1.title",
  "feature3.title",
  "feature5.title",
];

const TESTIMONIAL_META = [
  { initials: "AR", bg: "#1877F2" },
  { initials: "SN", bg: "#E4405F" },
  { initials: "BS", bg: "#25D366" },
  { initials: "DL", bg: "#FF0000" },
  { initials: "RP", bg: "#0A66C2" },
  { initials: "MK", bg: "#26A5E4" },
];

/* ================================================================
   LANDING PAGE CONTENT — Gerti/x Inspired Design
   ================================================================ */

function LandingPageInner() {
  const { t } = useI18n();

  const steps = [
    { titleKey: "step1.title", descKey: "step1.desc" },
    { titleKey: "step2.title", descKey: "step2.desc" },
    { titleKey: "step3.title", descKey: "step3.desc" },
    { titleKey: "step4.title", descKey: "step4.desc" },
  ];

  const features = [
    { titleKey: "feature1.title", descKey: "feature1.desc" },
    { titleKey: "feature2.title", descKey: "feature2.desc" },
    { titleKey: "feature3.title", descKey: "feature3.desc" },
    { titleKey: "feature4.title", descKey: "feature4.desc" },
    { titleKey: "feature5.title", descKey: "feature5.desc" },
    { titleKey: "feature6.title", descKey: "feature6.desc" },
  ];

  const testimonials = TESTIMONIAL_META.map((meta, i) => ({
    name: t(`testimonial${i + 1}.name`),
    role: t(`testimonial${i + 1}.role`),
    text: t(`testimonial${i + 1}.text`),
    ...meta,
  }));

  const footerLinks = [
    { label: t("footer.howItWorks"), href: "#how-it-works" },
    { label: t("footer.testimonials"), href: "#testimonials" },
    { label: t("footer.login"), href: "/login" },
    { label: t("footer.register"), href: "/register" },
  ];

  return (
    <div className="gx-page">
      <LandingAnimations />

      {/* ——— Nav ——— */}
      <nav className="gx-nav" data-landing-nav>
        <div className="gx-nav-inner">
          <Link href="/" className="gx-nav-logo">
            mediea<span>/</span>solution
          </Link>
          <div className="gx-nav-menu">
            <a href="#hero" className="gx-nav-item">
              <span className="gx-nav-num">01</span> HOME
            </a>
            <a href="#how-it-works" className="gx-nav-item">
              <span className="gx-nav-num">02</span> {t("nav.howItWorks").toUpperCase()}
            </a>
            <a href="#testimonials" className="gx-nav-item">
              <span className="gx-nav-num">03</span> {t("nav.testimonials").toUpperCase()}
            </a>
            <a href="#access" className="gx-nav-item">
              <span className="gx-nav-num">04</span> CONTACT
            </a>
          </div>
          <div className="gx-nav-actions">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ——— Hero ——— */}
      <section id="hero" className="gx-hero">
        <div className="gx-hero-overlay" />
        <div className="gx-hero-content">
          <div className="gx-hero-text">
            <h1 className="gx-hero-title gx-hero-animate-1">
              {t("hero.title1")}
              <em>{t("hero.titleHighlight")}</em>
              {t("hero.title2")}
            </h1>
            <p className="gx-hero-subtitle gx-hero-animate-2">
              {t("hero.subtitle")}
            </p>
            <div className="gx-hero-cta-group gx-hero-animate-3">
              <a href="#access" className="gx-btn-dark">
                {t("hero.cta")}
              </a>
              <a href="#access" className="gx-btn-arrow" aria-label="Go">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
          <div className="gx-hero-visual gx-hero-animate-4">
            <div className="gx-hero-image-wrapper">
              <img src="/hero-image.jpg" alt="Digital Recovery" className="gx-hero-img" />
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="gx-marquee">
          <div className="gx-marquee-track">
            {[...MARQUEE_KEYWORDS, ...MARQUEE_KEYWORDS, ...MARQUEE_KEYWORDS].map((item, i) => (
              <span key={i} className="gx-marquee-item">
                <span className="gx-marquee-text">{item.text}</span>
                <span className="gx-marquee-sep">{item.separator}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ——— About / Description Section (White) ——— */}
      <section className="gx-about" data-reveal>
        <div className="gx-about-inner">
          <p className="gx-about-text">
            {t("hero.title1")}
            <span className="gx-pill">{t("feature2.title")}</span>{" "}
            {t("hero.subtitle").split(".")[0]}.{" "}
            {t("why.title")}:{" "}
            <span className="gx-pill">{t("feature1.title")}</span>,{" "}
            <span className="gx-pill">{t("feature4.title")}</span>,{" "}
            <span className="gx-pill">{t("feature5.title")}</span>,{" "}
            <span className="gx-pill">{t("feature3.title")}</span>{" "}
            &amp;{" "}
            <span className="gx-pill">{t("feature6.title")}</span>.
          </p>
        </div>
      </section>

      {/* ——— Stats Section (Cross Grid) ——— */}
      <section className="gx-stats" data-reveal>
        <div className="gx-stats-grid">
          {STAT_DATA.map((stat, i) => (
            <div key={stat.labelKey} className="gx-stat-item" data-reveal data-reveal-delay={String(i * 100)}>
              <div className="gx-stat-number">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </div>
              <p className="gx-stat-label">{t(stat.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— How It Works ——— */}
      <section id="how-it-works" className="gx-services">
        <div className="gx-services-header" data-reveal>
          <p className="gx-section-label">
            {t("howItWorks.sectionLabel")}
          </p>
          <h2 className="gx-section-title">{t("howItWorks.title")}</h2>
          <p className="gx-section-subtitle">{t("howItWorks.subtitle")}</p>
        </div>

        {steps.map((step, i) => (
          <div
            key={step.titleKey}
            className={`gx-service ${i % 2 !== 0 ? "gx-service-reverse" : ""}`}
            data-reveal={i % 2 === 0 ? "left" : "right"}
            data-reveal-delay={String(i * 100)}
          >
            <div className="gx-service-info">
              <span className="gx-service-number">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="gx-service-title">{t(step.titleKey)}</h3>
              <p className="gx-service-desc">{t(step.descKey)}</p>
            </div>
            <div className="gx-service-visual">
              <div className="gx-service-image">
                <span className="gx-service-step-num">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ——— Features Grid ——— */}
      <section className="gx-features-section">
        <div className="gx-features-header" data-reveal>
          <p className="gx-section-label">{t("why.sectionLabel")}</p>
          <h2 className="gx-section-title">{t("why.title")}</h2>
        </div>
        <div className="gx-features-grid">
          {features.map((feature, i) => (
            <div key={feature.titleKey} className="gx-feature-card" data-reveal data-reveal-delay={String(i * 80)}>
              <span className="gx-feature-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="gx-feature-title">{t(feature.titleKey)}</h3>
              <p className="gx-feature-desc">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Platforms ——— */}
      <section className="gx-platforms" data-reveal>
        <p className="gx-platforms-label">{t("platforms.label")}</p>
        <div className="gx-platforms-grid">
          {PLATFORM_ICONS.map((platform) => (
            <div key={platform.name} className="gx-platform-item">
              <span className="gx-platform-icon">{platform.icon}</span>
              <span className="gx-platform-name">{platform.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ——— Testimonials ——— */}
      <section id="testimonials" className="gx-testimonials-section">
        <div className="gx-testimonials-header" data-reveal>
          <p className="gx-section-label">{t("testimonials.sectionLabel")}</p>
          <h2 className="gx-section-title">{t("testimonials.title")}</h2>
          <p className="gx-section-subtitle">{t("testimonials.subtitle")}</p>
        </div>

        <div className="gx-testimonials-track-wrapper" data-reveal data-reveal-delay="100">
          <div className="gx-testimonials-track">
            {[...testimonials, ...testimonials].map((tItem, i) => (
              <div key={`${tItem.name}-${i}`} className="gx-testimonial-card">
                <div className="gx-testimonial-stars">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="gx-testimonial-text">
                  &ldquo;{tItem.text}&rdquo;
                </p>
                <div className="gx-testimonial-author">
                  <div className="gx-testimonial-avatar" style={{ background: tItem.bg }}>
                    {tItem.initials}
                  </div>
                  <div>
                    <p className="gx-testimonial-name">{tItem.name}</p>
                    <p className="gx-testimonial-role">{tItem.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FAQ Section ——— */}
      <FAQSection />

      {/* ——— Access Code ——— */}
      <section id="access" className="gx-access">
        <div className="gx-access-inner" data-reveal>
          <span className="gx-access-number">05</span>
          <p className="gx-section-label">{t("access.sectionLabel")}</p>
          <h2 className="gx-section-title">{t("access.title")}</h2>
          <p className="gx-section-subtitle">{t("access.subtitle")}</p>

          <div className="gx-access-form">
            <LandingAccessCodeForm />
          </div>

          <p className="gx-access-help">
            {t("access.noCode")}{" "}
            <Link href="/portal/support" className="gx-access-link">
              {t("access.contact")}
            </Link>{" "}
            {t("access.noCodeSuffix")}
          </p>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="gx-footer">
        <div className="gx-footer-inner" data-reveal>
          <div className="gx-footer-grid">
            {/* Brand */}
            <div className="gx-footer-brand">
              <Link href="/" className="gx-footer-logo">
                mediea<span>/</span>solution
              </Link>
              <p className="gx-footer-tagline">{t("footer.tagline")}</p>
            </div>

            {/* Links */}
            <div className="gx-footer-col">
              <h4 className="gx-footer-heading">{t("footer.nav")}</h4>
              <div className="gx-footer-links">
                {footerLinks.map((link) => (
                  <a key={link.label} href={link.href} className="gx-footer-link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="gx-footer-col">
              <h4 className="gx-footer-heading">{t("footer.contact")}</h4>
              <div className="gx-footer-links">
                <a href="https://wa.me/6281241511156" target="_blank" rel="noopener noreferrer" className="gx-footer-link">
                  081241511156
                </a>
                <a href="https://mediea.co.id" target="_blank" rel="noopener noreferrer" className="gx-footer-link">
                  mediea.co.id
                </a>
              </div>
            </div>
          </div>

          <div className="gx-footer-bottom">
            <p className="gx-footer-copy">
              &copy; {new Date().getFullYear()} Mediea Solution. All rights reserved.
            </p>
            <div className="gx-footer-status">
              <span className="gx-status-dot" />
              <span className="gx-status-text">{t("footer.systemActive")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ——— Exported Wrapped Component ——— */
export function LandingPageContent() {
  return (
    <I18nProvider>
      <LandingPageInner />
    </I18nProvider>
  );
}
