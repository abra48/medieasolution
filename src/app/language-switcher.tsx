"use client";

import { useI18n, type Locale } from "@/lib/i18n";
import { useState, useRef, useEffect, useCallback } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (lang: Locale) => { setLocale(lang); setOpen(false); },
    [setLocale]
  );

  const label = locale === "id" ? "ID" : "EN";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 999, background: "transparent", cursor: "pointer",
          color: "var(--gx-text-light, #e8e6e1)", fontSize: 11,
          fontWeight: 500, letterSpacing: "0.06em", transition: "all 0.2s ease",
        }}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "100%", marginTop: 8,
          padding: "4px 0", borderRadius: 8, minWidth: 120, zIndex: 50,
          background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {([["id", "Indonesia"], ["en", "English"]] as [Locale, string][]).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 8,
                padding: "10px 16px", background: "transparent", border: "none",
                cursor: "pointer", fontSize: 13, textAlign: "left" as const,
                color: locale === code ? "#e8e6e1" : "#7a7a72",
                fontWeight: locale === code ? 600 : 400,
              }}
            >
              <span>{name}</span>
              {locale === code && <span style={{ marginLeft: "auto", fontSize: 11, color: "#7a7a72" }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
