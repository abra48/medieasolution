"use client";

import { useActionState } from "react";
import {
  redeemAccessCode,
  type AccessCodeState,
} from "@/app/actions/codes";

export function AccessCodeRedeemer() {
  const [state, action, pending] = useActionState<AccessCodeState, FormData>(
    redeemAccessCode,
    null
  );

  if (state?.success) {
    return (
      <div className="card !border-accent-green/30 !bg-accent-green/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-accent-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-accent-green">
              {state.message}
            </p>
            <p className="text-sm text-text-secondary mt-0.5">
              Refresh the page to access premium recovery guides.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card !p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-accent-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Gunakan Kode Akses
          </h3>
          <p className="text-sm text-text-secondary">
            Masukkan kode akses untuk membuka panduan premium
          </p>
        </div>
      </div>

      <form action={action} className="space-y-4">
        {/* Error Message */}
        {state?.error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20">
            <svg
              className="w-5 h-5 text-danger shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-sm text-danger font-medium">
              {state.error}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <input
            name="code"
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            maxLength={20}
            autoComplete="off"
            className="input flex-1 font-mono tracking-[0.2em] uppercase text-center text-lg"
            style={{ letterSpacing: "0.2em" }}
          />
          <button
            type="submit"
            disabled={pending}
            className="btn-gold !px-6 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <svg
                className="animate-spin w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Redeem"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
