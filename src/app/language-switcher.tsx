"use client";

import { useI18n, type Locale } from "@/lib/i18n";
import { useState, useRef, useEffect, useCallback } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (lang: Locale) => {
      setLocale(lang);
      setOpen(false);
    },
    [setLocale]
  );

  const currentFlag = locale === "id" ? "🇮🇩" : "🇬🇧";
  const currentLabel = locale === "id" ? "ID" : "EN";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="landing-theme-toggle flex items-center gap-1.5 !px-2.5"
        aria-label={locale === "id" ? "Ganti ke Bahasa Inggris" : "Switch to Indonesian"}
        title={locale === "id" ? "Ganti bahasa" : "Change language"}
      >
        <span className="text-sm leading-none">{currentFlag}</span>
        <span className="text-[11px] font-semibold l-text">{currentLabel}</span>
        <svg
          className={`w-3 h-3 l-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 py-1 rounded-xl shadow-xl z-50 min-w-[120px] animate-fade-in"
          style={{
            background: "var(--l-card-bg, #18181b)",
            border: "1px solid var(--l-border, #27272a)",
          }}
        >
          <button
            onClick={() => handleSelect("id")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-white/5 ${locale === "id" ? "l-text-accent font-semibold" : "l-text-secondary"}`}
          >
            <span className="text-base leading-none">🇮🇩</span>
            <span>Indonesia</span>
            {locale === "id" && (
              <svg className="w-3.5 h-3.5 ml-auto text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => handleSelect("en")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-white/5 ${locale === "en" ? "l-text-accent font-semibold" : "l-text-secondary"}`}
          >
            <span className="text-base leading-none">🇬🇧</span>
            <span>English</span>
            {locale === "en" && (
              <svg className="w-3.5 h-3.5 ml-auto text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
