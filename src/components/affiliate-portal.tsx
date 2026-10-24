"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AffiliateData = {
  referral_code: string;
  referral_url: string;
};

export function AffiliatePortal({ userId }: { userId: string }) {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: affiliate } = await supabase
          .from("users")
          .select("referral_code")
          .eq("id", userId)
          .not("referral_code", "is", null)
          .single();

        if (affiliate) {
          setData({
            referral_code: affiliate.referral_code,
            referral_url: `${window.location.origin}/register?ref=${affiliate.referral_code}`,
          });
        }
      } catch {
        // No affiliate data
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const copyLink = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.referral_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return <div className="h-24 rounded-lg bg-skeleton" />;
  }

  if (!data) {
    return (
      <div className="card text-center !py-8">
        <p className="text-sm text-text-secondary">Affiliate profile not found.</p>
        <p className="text-xs text-text-tertiary mt-1">Contact support to set up your affiliate account.</p>
      </div>
    );
  }

  return (
    <div className="card !p-5 space-y-3">
      <div>
        <p className="text-xs text-text-tertiary mb-1">Referral Code</p>
        <p className="text-base font-mono font-bold text-accent">{data.referral_code}</p>
      </div>

      <div>
        <p className="text-xs text-text-tertiary mb-1">Referral Link</p>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={data.referral_url}
            className="input flex-1 text-xs font-mono"
          />
          <button onClick={copyLink} className={`btn-primary !py-2 !px-4 !text-xs shrink-0 ${copied ? "!bg-accent-dim" : ""}`}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
