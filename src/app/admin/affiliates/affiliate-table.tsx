"use client";

import { useState, useCallback } from "react";

type Affiliate = {
  id: string;
  role: string;
  referral_code: string | null;
  referral_count: number;
  created_at: string;
  codes_used: number;
  actual_referrals: number;
};

export function AffiliateTable({ affiliates }: { affiliates: Affiliate[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = useCallback(async (code: string, id: string) => {
    const link = `https://medieasolution.com/?ref=${code}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-text-primary">Daftar Affiliate</h2>
        <span className="text-xs text-text-tertiary">{affiliates.length} pengguna</span>
      </div>

      <div
        className="border border-border-default overflow-hidden"
        style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-bg-secondary border-b border-border-default">
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">#</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">User ID</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Kode Referral</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Referral Link</th>
                <th className="text-center text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5">Referral</th>
                <th className="text-center text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden sm:table-cell">Kode Dipakai</th>
                <th className="text-left text-[10px] font-semibold text-text-tertiary uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {affiliates.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-text-tertiary text-sm">
                    Belum ada pengguna affiliate terdaftar.
                  </td>
                </tr>
              )}
              {affiliates.map((aff, index) => (
                <tr key={aff.id} className="bg-bg-primary hover:bg-bg-secondary/40 transition-colors">
                  {/* Index */}
                  <td className="px-4 py-2.5 text-xs text-text-tertiary font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  {/* User ID (truncated) */}
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-mono text-text-secondary tracking-wider">
                      {aff.id.substring(0, 8)}…{aff.id.substring(aff.id.length - 4)}
                    </span>
                  </td>

                  {/* Referral Code */}
                  <td className="px-4 py-2.5">
                    {aff.referral_code ? (
                      <code
                        className="text-xs font-mono font-bold text-accent-gold tracking-[0.15em] bg-accent-gold/10 px-1.5 py-0.5"
                        style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                      >
                        {aff.referral_code}
                      </code>
                    ) : (
                      <span className="text-xs text-text-tertiary italic">Belum tersedia</span>
                    )}
                  </td>

                  {/* Referral Link + Copy */}
                  <td className="px-4 py-2.5">
                    {aff.referral_code ? (
                      <button
                        onClick={() => copyLink(aff.referral_code!, aff.id)}
                        className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider
                          px-2 py-1 border transition-all duration-200
                          ${copiedId === aff.id
                            ? "bg-accent-green/15 text-accent-green border-accent-green/30"
                            : "bg-bg-tertiary/40 text-text-tertiary border-border-default hover:text-accent-green hover:border-accent-green/30"
                          }`}
                        style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
                      >
                        {copiedId === aff.id ? (
                          <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Tersalin
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Salin Link
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-text-tertiary">—</span>
                    )}
                  </td>

                  {/* Referral Count */}
                  <td className="px-4 py-2.5 text-center">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-accent-green bg-accent-green/10 border border-accent-green/20"
                      style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                    >
                      {aff.actual_referrals}
                    </span>
                  </td>

                  {/* Codes Used */}
                  <td className="px-4 py-2.5 text-center hidden sm:table-cell">
                    <span className="text-xs font-mono text-text-secondary">{aff.codes_used}</span>
                  </td>

                  {/* Registration Date */}
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span className="text-xs text-text-tertiary">
                      {new Date(aff.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div
        className="mt-3 flex items-center gap-2 px-3 py-2 bg-bg-secondary/50 border border-border-subtle text-xs text-text-tertiary"
        style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
      >
        <svg className="w-3.5 h-3.5 shrink-0 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Kode referral di-generate otomatis saat role pengguna diubah menjadi &quot;affiliate&quot;.
      </div>
    </div>
  );
}
