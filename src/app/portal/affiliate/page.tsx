import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AffiliatePortal } from "@/components/affiliate-portal";

export default async function AffiliatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify affiliate role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "affiliate") {
    redirect("/portal");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          Affiliate <span className="text-gradient-gold">Portal</span>
        </h1>
        <p className="text-text-secondary">
          Kelola dan bagikan link referral Anda untuk mendapatkan komisi.
        </p>
      </div>

      {/* Affiliate Portal Component */}
      <AffiliatePortal userId={user.id} />

      {/* Stats Placeholder */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1.5 h-1.5 bg-accent-gold"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          />
          <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
            Statistik Referral
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Klik", value: "—", icon: "📊" },
            { label: "Pengguna Terdaftar", value: "—", icon: "👤" },
            { label: "Komisi Pending", value: "—", icon: "💰" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-bg-primary border border-border-default px-5 py-4 flex items-center gap-4"
              style={{
                clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
              }}
            >
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-tertiary mt-3 italic">
          Statistik detail akan tersedia pada pembaruan selanjutnya.
        </p>
      </div>
    </div>
  );
}
