"use client";

import { useState, useEffect, useCallback } from "react";
import { getSavedIsDark, applyTheme, saveTheme } from "@/lib/theme";

/**
 * Global theme toggle — works on ALL pages (portal, login, register, etc.)
 * Toggles `data-theme="light"` on <html> and persists to localStorage.
 */
export function GlobalThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = getSavedIsDark();
    setDark(isDark);
    applyTheme(isDark);
  }, []);

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    saveTheme(next);
    applyTheme(next);
  }, [dark]);

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Mode terang" : "Mode gelap"}
      className="global-theme-toggle"
    >
      {/* Sun */}
      <svg
        className={`global-theme-icon ${dark ? "" : "global-theme-icon-hidden"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      {/* Moon */}
      <svg
        className={`global-theme-icon ${!dark ? "" : "global-theme-icon-hidden"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
