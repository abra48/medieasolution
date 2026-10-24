import { createClient } from "@/lib/supabase/server";
import { AffiliateTable } from "./affiliate-table";

export default async function AffiliateManagementPage() {
  const supabase = await createClient();

  // Fetch all affiliate users with their referral stats
  const { data: affiliates } = await supabase
    .from("users")
    .select("id, role, referral_code, referral_count, created_at")
    .eq("role", "affiliate")
    .order("created_at", { ascending: false });

  // Fetch code usage per affiliate (used_by counts)
  const { data: codeUsage } = await supabase
    .from("access_codes")
    .select("used_by")
    .eq("is_used", true);

  // Build a map of user_id → number of codes redeemed
  const codeUsageMap: Record<string, number> = {};
  if (codeUsage) {
    for (const row of codeUsage) {
      if (row.used_by) {
        codeUsageMap[row.used_by] = (codeUsageMap[row.used_by] || 0) + 1;
      }
    }
  }

  // Fetch referred users per affiliate
  const { data: referrals } = await supabase
    .from("users")
    .select("referred_by")
    .not("referred_by", "is", null);

  const referralMap: Record<string, number> = {};
  if (referrals) {
    for (const row of referrals) {
      if (row.referred_by) {
        referralMap[row.referred_by] = (referralMap[row.referred_by] || 0) + 1;
      }
    }
  }

  const allAffiliates = (affiliates || []).map((a) => ({
    ...a,
    codes_used: codeUsageMap[a.id] || 0,
    actual_referrals: referralMap[a.id] || 0,
  }));

  const totalAffiliates = allAffiliates.length;
  const totalReferrals = allAffiliates.reduce((acc, a) => acc + a.actual_referrals, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-gold">Affiliate</span>
        </h1>
        <p className="text-sm text-text-secondary">
          Monitor dan kelola pengguna affiliate beserta statistik referral mereka.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Affiliate", value: totalAffiliates, color: "text-accent-gold", bg: "bg-accent-gold/5" },
          { label: "Total Referral", value: totalReferrals, color: "text-accent-green", bg: "bg-accent-green/5" },
          { label: "Konversi Rata-Rata", value: totalAffiliates > 0 ? (totalReferrals / totalAffiliates).toFixed(1) : "0", color: "text-text-primary", bg: "bg-bg-secondary" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-border-default px-4 py-3`}
            style={{ clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)" }}
          >
            <p className={`text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</p>
            <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <AffiliateTable affiliates={allAffiliates} />
    </div>
  );
}
