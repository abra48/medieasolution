"use client";

import { useI18n, type Locale } from "@/lib/i18n";
import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Global language switcher — works on ALL pages.
 * Uses portal/global CSS vars instead of landing-specific ones.
 */
export function GlobalLanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const currentLabel = locale === "id" ? "ID" : "EN";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="global-theme-toggle flex items-center gap-1.5 !w-auto !px-2.5"
        aria-label={locale === "id" ? "Ganti ke Bahasa Inggris" : "Switch to Indonesian"}
        title={locale === "id" ? "Ganti bahasa" : "Change language"}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-[11px] font-semibold">{currentLabel}</span>
        <svg
          className={`w-3 h-3 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 py-1 rounded-xl shadow-xl z-50 min-w-[120px] animate-fade-in"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <button
            onClick={() => handleSelect("id")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-white/5 ${locale === "id" ? "text-accent font-semibold" : "text-text-secondary"}`}
          >
            <span className="text-base leading-none">🇮🇩</span>
            <span>Indonesia</span>
            {locale === "id" && (
              <svg className="w-3.5 h-3.5 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <button
            onClick={() => handleSelect("en")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-white/5 ${locale === "en" ? "text-accent font-semibold" : "text-text-secondary"}`}
          >
            <span className="text-base leading-none">🇬🇧</span>
            <span>English</span>
            {locale === "en" && (
              <svg className="w-3.5 h-3.5 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
