"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { redeemAccessCode } from "@/app/actions/codes";

export function LandingAccessCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        // If authentication error, redirect to login with the code pre-filled
        if (result.error.includes("Autentikasi")) {
          router.push(`/login?redirect=/portal&code=${encodeURIComponent(trimmed)}`);
          return;
        }
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.message || "Kode berhasil diaktifkan!");
        // Redirect to portal after a brief success message
        setTimeout(() => {
          router.push("/portal");
        }, 1000);
      }
    } catch {
      // Server action might throw if user isn't authenticated
      router.push(`/login?redirect=/portal&code=${encodeURIComponent(trimmed)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          placeholder="MASUKKAN KODE ANDA"
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
              Memvalidasi...
            </span>
          ) : success ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Berhasil! Mengalihkan...
            </span>
          ) : (
            "Buka Akses"
          )}
        </button>
      </form>

      <p className="text-[10px] text-text-tertiary">
        Belum punya akun?{" "}
        <a href="/register" className="text-accent hover:underline">
          Daftar dulu
        </a>
        , lalu masukkan kode akses Anda.
      </p>
    </div>
  );
}
