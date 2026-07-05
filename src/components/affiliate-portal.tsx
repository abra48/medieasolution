"use client";

import { useState, useCallback } from "react";

export function AffiliatePortal({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://medieasolution.com/?ref=${userId.substring(0, 12)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = referralLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [referralLink]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center bg-accent-gold/15 text-accent-gold"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Affiliate Portal</h3>
          <p className="text-sm text-text-secondary">
            Bagikan link referral Anda untuk mendapatkan komisi.
          </p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div
        className="bg-bg-primary border border-border-default"
        style={{
          clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
        }}
      >
        {/* 3D inset */}
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)",
            }}
          />

          <div className="px-5 py-5 space-y-4">
            {/* Label */}
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 bg-accent-gold"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              />
              <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                Link Referral Anda
              </p>
            </div>

            {/* Link Input + Copy Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full px-4 py-3 bg-bg-input border border-border-default text-text-primary
                             font-mono text-sm tracking-wider cursor-default
                             focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.15)]
                             transition-all duration-200"
                  style={{
                    clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                  }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                {/* Lock icon */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3
                  font-bold text-sm transition-all duration-300
                  active:scale-[0.97]
                  ${
                    copied
                      ? "bg-accent-green text-text-inverse"
                      : "bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-[#1e252b] hover:shadow-[0_0_24px_rgba(255,215,0,0.3)]"
                  }`}
                style={{
                  clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                }}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Tersalin!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="space-y-2 pt-2 border-t border-border-subtle">
              <p className="text-xs text-text-tertiary leading-relaxed">
                Bagikan link di atas kepada calon pengguna. Setiap pengguna yang mendaftar melalui link referral Anda akan tercatat di sistem.
              </p>
              <div className="flex items-center gap-2 text-xs text-accent-gold/70">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Link bersifat permanen dan unik untuk akun Anda.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
