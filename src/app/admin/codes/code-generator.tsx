"use client";

import { useActionState, useState } from "react";
import {
  generateAccessCodes,
  type GenerateCodesState,
} from "@/app/actions/codes";

export function CodeGenerator() {
  const [state, action, pending] = useActionState<GenerateCodesState, FormData>(
    generateAccessCodes,
    null
  );
  const [copied, setCopied] = useState(false);

  const copyAllCodes = async () => {
    if (!state?.codes) return;
    try {
      await navigator.clipboard.writeText(state.codes.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = state.codes.join("\n");
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      className="bg-bg-secondary border border-border-default"
      style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-default flex items-center gap-2">
        <div
          className="w-7 h-7 flex items-center justify-center bg-accent-green/15 text-accent-green"
          style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Generator Kode Akses</h3>
          <p className="text-[10px] text-text-tertiary">Buat kode alfanumerik acak untuk distribusi</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Form */}
        <form action={action} className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div className="w-full sm:w-auto">
            <label
              htmlFor="code-qty"
              className="block text-[10px] font-semibold text-text-tertiary uppercase tracking-wider mb-1.5"
            >
              Jumlah Kode (1–100)
            </label>
            <input
              id="code-qty"
              name="quantity"
              type="number"
              min={1}
              max={100}
              defaultValue={10}
              required
              className="input !py-2 text-center font-mono w-full sm:w-32"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="btn-primary !py-2 shrink-0 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Memproses...
              </span>
            ) : (
              "Generate Kode"
            )}
          </button>
        </form>

        {/* Error */}
        {state?.error && (
          <div
            className="flex items-center gap-2 px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs text-danger"
            style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {state.error}
          </div>
        )}

        {/* Success */}
        {state?.success && state.codes && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-medium text-accent-green">
                  {state.count} kode berhasil di-generate
                </p>
              </div>
              <button
                onClick={copyAllCodes}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider
                  transition-all duration-300 border ${
                    copied
                      ? "bg-accent-green/15 text-accent-green border-accent-green/30"
                      : "bg-bg-tertiary/40 text-text-tertiary border-border-default hover:text-accent-green hover:border-accent-green/40"
                  }`}
                style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
              >
                {copied ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Tersalin
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Salin Semua
                  </>
                )}
              </button>
            </div>

            <div
              className="bg-bg-input border border-border-default p-4 max-h-52 overflow-y-auto"
              style={{ clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)" }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-1.5">
                {state.codes.map((code, i) => (
                  <span key={code} className="flex items-center gap-1.5 text-xs font-mono tracking-[0.12em]">
                    <span className="text-text-tertiary text-[9px] w-5 text-right shrink-0">{i + 1}.</span>
                    <span className="text-text-primary">{code}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
