"use client";

import { useEffect } from "react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Portal Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div
        className="bg-bg-primary border border-border-default max-w-md w-full"
        style={{
          clipPath: "polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
        }}
      >
        <div className="h-[2px] bg-[#EF4444]" />
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{ boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)" }}
          />
          <div className="p-8 space-y-5 text-center">
            <div
              className="w-14 h-14 flex items-center justify-center bg-[#EF4444]/10 text-danger mx-auto"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">
                Gagal Memuat Halaman
              </h2>
              <p className="text-xs text-text-tertiary leading-relaxed">
                Terjadi kesalahan saat memproses permintaan. Periksa koneksi Anda dan coba lagi.
              </p>
            </div>

            {error.digest && (
              <div
                className="bg-bg-input border border-border-default px-3 py-1.5 text-[10px] font-mono text-text-tertiary"
                style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
              >
                Kode Referensi: {error.digest}
              </div>
            )}

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold
                         bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-[#1e252b]
                         hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300"
              style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
