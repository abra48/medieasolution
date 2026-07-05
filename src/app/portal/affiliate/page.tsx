import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AffiliatePortal } from "@/components/affiliate-portal";

export default async function AffiliatePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "affiliate") redirect("/portal");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Affiliate Portal</h1>
        <p className="text-sm text-text-tertiary">Manage and share your referral links.</p>
      </div>

      <AffiliatePortal userId={user.id} />

      <div>
        <p className="text-xs text-text-tertiary uppercase tracking-wider mb-3">Referral Stats</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Total Clicks", value: "—" },
            { label: "Registered Users", value: "—" },
            { label: "Pending Commission", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="card !p-4">
              <p className="text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-tertiary mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-tertiary mt-3 italic">
          Detailed stats available in a future update.
        </p>
      </div>
    </div>
  );
}
