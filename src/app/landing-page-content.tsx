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

/* ——— Step Icons (static) ——— */
const STEP_ICONS = [
  <svg key="s1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>,
  <svg key="s2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>,
  <svg key="s3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>,
  <svg key="s4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>,
];

/* ——— Feature Icons (static) ——— */
const FEATURE_ICONS = [
  <svg key="f1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
  </svg>,
  <svg key="f2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>,
  <svg key="f3" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
  <svg key="f4" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>,
  <svg key="f5" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
  </svg>,
  <svg key="f6" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>,
];

/* ——— Stat Icons (static) ——— */
const STAT_ICONS = [
  <svg key="st1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>,
  <svg key="st2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>,
  <svg key="st3" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>,
  <svg key="st4" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>,
];

const STAT_DATA = [
  { target: 500, suffix: "+" },
  { target: 8, suffix: "+" },
  { target: 200, suffix: "+" },
  { target: 99, suffix: "%" },
];

const STAT_LABEL_KEYS = [
  "stats.recovered",
  "stats.platforms",
  "stats.solutions",
  "stats.successRate",
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
   LANDING PAGE CONTENT — with i18n
   ================================================================ */

function LandingPageInner() {
  const { t } = useI18n();

  /* Build translated data */
  const steps = [
    { titleKey: "step1.title", descKey: "step1.desc", icon: STEP_ICONS[0] },
    { titleKey: "step2.title", descKey: "step2.desc", icon: STEP_ICONS[1] },
    { titleKey: "step3.title", descKey: "step3.desc", icon: STEP_ICONS[2] },
    { titleKey: "step4.title", descKey: "step4.desc", icon: STEP_ICONS[3] },
  ];

  const features = [
    { titleKey: "feature1.title", descKey: "feature1.desc", icon: FEATURE_ICONS[0] },
    { titleKey: "feature2.title", descKey: "feature2.desc", icon: FEATURE_ICONS[1] },
    { titleKey: "feature3.title", descKey: "feature3.desc", icon: FEATURE_ICONS[2] },
    { titleKey: "feature4.title", descKey: "feature4.desc", icon: FEATURE_ICONS[3] },
    { titleKey: "feature5.title", descKey: "feature5.desc", icon: FEATURE_ICONS[4] },
    { titleKey: "feature6.title", descKey: "feature6.desc", icon: FEATURE_ICONS[5] },
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
              {t("nav.howItWorks")}
            </a>
            <a href="#testimonials" className="hidden sm:block text-sm landing-link-muted">
              {t("nav.testimonials")}
            </a>
            <Link href="/login" className="hidden sm:block text-sm landing-link-muted">
              {t("nav.login")}
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/register" className="landing-btn !py-2 !px-5 !text-xs !rounded-full">
              {t("nav.register")}
            </Link>
          </div>
        </div>
      </nav>

      {/* ——— Hero ——— */}
      <section className="relative flex flex-col items-center justify-center px-4 sm:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24">
        {/* Bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'var(--l-border)' }} />

        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="hero-animate hero-animate-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 landing-badge">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--l-accent)] dot-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] l-text-accent">
              {t("hero.badge")}
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-animate hero-animate-2 hero-title text-3xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-semibold leading-[1.05] tracking-[-0.035em] mb-5 sm:mb-6 text-balance">
            <span className="l-text">{t("hero.title1")}</span>
            <span className="l-text-accent">{t("hero.titleHighlight")}</span>
            <span className="l-text">{t("hero.title2")}</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-animate hero-animate-3 hero-subtitle max-w-[38ch] mx-auto text-base leading-relaxed mb-8 sm:mb-10 l-text-secondary text-pretty">
            {t("hero.subtitle")}
          </p>

          {/* CTA */}
          <div className="hero-animate hero-animate-4 flex flex-wrap items-center justify-center gap-3">
            <a href="#access" className="landing-btn">
              {t("hero.cta")}
            </a>
            <a href="#how-it-works" className="landing-btn-outline">
              {t("hero.secondary")}
            </a>
          </div>

          {/* Social proof line */}
          <p className="hero-animate hero-animate-5 mt-6 text-sm l-text-muted">
            <span className="font-medium l-text-secondary">500+</span> {t("hero.usersHelped")}
          </p>
        </div>


      </section>

      {/* ——— Platforms Marquee ——— */}
      <section className="py-8 sm:py-12 border-t border-b l-border-light overflow-hidden">
        <div data-reveal="fade" data-reveal-delay="0">
          <p className="text-center text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-6 sm:mb-8 l-text-muted">
            {t("platforms.label")}
          </p>
          <div className="relative overflow-hidden">
            <div className="marquee-track">
              {[...PLATFORM_ICONS, ...PLATFORM_ICONS].map((platform, i) => (
                <div key={`${platform.name}-${i}`} className="marquee-item-premium mx-2">
                  <span className="opacity-80">{platform.icon}</span>
                  <span className="marquee-name text-base sm:text-xl font-light whitespace-nowrap l-text">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Stats Section ——— */}
      <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" data-reveal data-reveal-delay="0">
            {STAT_DATA.map((stat, i) => (
              <div key={STAT_LABEL_KEYS[i]} className={`stat-card stagger-${i + 1}`} data-reveal data-reveal-delay={String(i * 100)}>
                <div className="stat-icon">
                  {STAT_ICONS[i]}
                </div>
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <p className="stat-label">{t(STAT_LABEL_KEYS[i])}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— How It Works — Horizontal Stepper ——— */}
      <section id="how-it-works" className="py-16 sm:py-24 md:py-32 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-20" data-reveal>
            <p className="section-label justify-center mb-4">
              {t("howItWorks.sectionLabel")}
            </p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight l-text">
              {t("howItWorks.title")}
            </h2>
            <p className="max-w-md mx-auto mt-4 text-sm sm:text-base l-text-secondary">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          {/* Horizontal Stepper */}
          <div className="stepper-container" data-reveal data-reveal-delay="100">
            {/* Connecting line */}
            <div className="stepper-line">
              <div className="stepper-line-fill revealed" />
            </div>

            {steps.map((step, i) => (
              <div key={step.titleKey} className={`stepper-step ${i === 1 ? 'stepper-step-active' : ''}`}>
                <div className="stepper-icon">
                  {step.icon}
                </div>
                <div>
                  <h3 className="stepper-title">{t(step.titleKey)}</h3>
                  <p className="stepper-desc">{t(step.descKey)}</p>
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
            <p className="section-label justify-center mb-4">
              {t("why.sectionLabel")}
            </p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight l-text">
              {t("why.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature, i) => (
              <div key={feature.titleKey} data-reveal data-reveal-delay={String(i * 80)}>
                <div className="landing-card group cursor-default">
                  <div className="landing-icon-box w-10 h-10 rounded-xl flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold mb-2 l-text">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed l-text-secondary">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="landing-divider max-w-5xl mx-auto" />

      {/* ——— Testimonials ——— */}
      <section id="testimonials" className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-reveal>
            <p className="section-label justify-center mb-4">
              {t("testimonials.sectionLabel")}
            </p>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight l-text">
              {t("testimonials.title")}
            </h2>
            <p className="max-w-md mx-auto mt-4 text-sm sm:text-base l-text-secondary">
              {t("testimonials.subtitle")}
            </p>
          </div>
        </div>

        {/* Testimonial Marquee */}
        <div className="relative overflow-hidden" data-reveal data-reveal-delay="100">
          <div className="testimonial-track">
            {[...testimonials, ...testimonials].map((tItem, i) => (
              <div key={`${tItem.name}-${i}`} className="testimonial-card w-[320px] sm:w-[360px] flex-shrink-0">
                {/* Stars */}
                <div className="testimonial-stars mb-3">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Text */}
                <p className="text-sm l-text-secondary leading-relaxed mb-4">
                  &ldquo;{tItem.text}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="testimonial-avatar"
                    style={{ background: tItem.bg }}
                  >
                    {tItem.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold l-text">{tItem.name}</p>
                    <p className="text-xs l-text-muted">{tItem.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="landing-divider max-w-5xl mx-auto" />

      {/* ——— FAQ Section ——— */}
      <FAQSection />

      {/* Divider */}
      <div className="landing-divider max-w-5xl mx-auto" />

      {/* ——— Access Code — Premium CTA ——— */}
      <section id="access" className="py-16 sm:py-24 md:py-32 px-4 sm:px-8 access-section-bg">
        <div className="max-w-md mx-auto text-center relative z-10" data-reveal>
          <div className="landing-icon-box w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>

          <p className="section-label justify-center mb-3">
            {t("access.sectionLabel")}
          </p>
          <h2 className="section-title text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3 l-text">
            {t("access.title")}
          </h2>
          <p className="text-sm mb-8 l-text-secondary">
            {t("access.subtitle")}
          </p>

          {/* Access code form */}
          <div className="landing-form-wrapper">
            <LandingAccessCodeForm />
          </div>

          <p className="text-xs mt-6 l-text-muted">
            {t("access.noCode")}{" "}
            <Link href="/portal/support" className="l-text-accent transition-colors duration-300 hover:underline">
              {t("access.contact")}
            </Link>{" "}
            {t("access.noCodeSuffix")}
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
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--l-accent)' }}>
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <span className="text-sm font-semibold tracking-tight l-text">
                  Mediea<span className="landing-gradient-text">Solution</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed l-text-secondary">
                {t("footer.tagline")}
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-4 l-text-muted">
                {t("footer.nav")}
              </h4>
              <div className="space-y-3">
                {footerLinks.map((link) => (
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
                {t("footer.contact")}
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
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] dot-pulse" />
                <span className="text-[10px] uppercase tracking-[0.15em] l-text-muted">
                  {t("footer.systemActive")}
                </span>
              </div>
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
