"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { redeemAccessCode } from "@/app/actions/codes";
import { useI18n } from "@/lib/i18n";

export function LandingAccessCodeForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [hasAccess, setHasAccess] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store" });
        const data = await res.json();
        setIsLoggedIn(data.authenticated === true);
        setHasAccess(data.hasAccess === true);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.set("code", trimmed);

      const result = await redeemAccessCode(null, formData);

      if (result?.error) {
        if (result.error.includes("Autentikasi")) {
          router.push(`/login?redirect=/portal&code=${encodeURIComponent(trimmed)}`);
          return;
        }
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.message || t("access.success"));
        setTimeout(() => {
          router.push("/portal");
        }, 1000);
      }
    } catch {
      router.push(`/login?redirect=/portal&code=${encodeURIComponent(code.trim())}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoggedIn === null) {
    return (
      <div className="space-y-3">
        <div className="landing-input text-center py-3 opacity-50">
          {t("access.checking")}
        </div>
      </div>
    );
  }

  // Not logged in — show login prompt
  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <p className="text-xs l-text-secondary text-center mb-2">
          {t("access.loginRequired")}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href="/login?redirect=/portal"
            className="landing-btn flex-1 !py-3 text-sm text-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {t("access.loginBtn")}
          </a>
          <a
            href="/register"
            className="landing-btn-outline flex-1 !py-3 text-sm text-center"
          >
            {t("access.createAccountBtn")}
          </a>
        </div>
      </div>
    );
  }

  // Logged in & code already redeemed — no need to enter a code again
  if (hasAccess) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 text-left">
          <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
          <span className="text-xs text-accent font-medium">{t("access.active")}</span>
        </div>
        <a href="/portal/troubleshoot" className="btn-accent-secondary w-full py-3 text-sm text-center block">
          {t("access.openPortal")}
        </a>
      </div>
    );
  }

  // Logged in — show code input form
  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-left animate-fade-in">
          <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs text-danger">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-accent/10 border border-accent/20 text-left animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
          <span className="text-xs text-accent font-medium">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          id="access-code-input"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            if (error) setError(null);
          }}
          placeholder={t("access.placeholder")}
          className="input text-center tracking-[0.2em] font-mono py-3 uppercase"
          maxLength={20}
          autoComplete="off"
          disabled={isSubmitting || !!success}
        />
        <button
          type="submit"
          disabled={!code.trim() || isSubmitting || !!success}
          className="btn-accent-secondary w-full py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("access.validating")}
            </span>
          ) : success ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t("access.success")}
            </span>
          ) : (
            t("access.submit")
          )}
        </button>
      </form>
    </div>
  );
}
