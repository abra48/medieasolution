"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { redeemAccessCode, type AccessCodeState } from "@/app/actions/codes";

export function AccessCodeRedeemer() {
  const router = useRouter();
  const [state, action, pending] = useActionState<AccessCodeState, FormData>(
    redeemAccessCode,
    null
  );

  // Auto-refresh when code is successfully redeemed
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.refresh();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  if (state?.success) {
    return (
      <div className="card !border-accent/20 !bg-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <div>
            <p className="text-sm font-medium text-accent">{state.message}</p>
            <p className="text-xs text-text-tertiary mt-0.5">Memuat panduan premium...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card !p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-1">Masukkan Kode Akses</h3>
      <p className="text-xs text-text-tertiary mb-4">Buka panduan pemulihan premium.</p>

      <form action={action} className="space-y-3">
        {state?.error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-danger/10 border border-danger/20">
            <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-danger">{state.error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <input
            name="code"
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            maxLength={20}
            autoComplete="off"
            className="input flex-1 font-mono tracking-widest uppercase text-center"
          />
          <button type="submit" disabled={pending} className="btn-accent-secondary !px-5 shrink-0 disabled:opacity-50">
            {pending ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Proses
              </span>
            ) : "Aktifkan"}
          </button>
        </div>
      </form>
    </div>
  );
}
