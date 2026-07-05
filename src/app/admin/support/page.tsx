import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "../assets/asset-form";
import { AssetTable } from "../assets/asset-table";

export default async function AdminSupportPage() {
  const supabase = await createClient();

  // Fetch FAQ and contact assets
  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_type, title, description, content, image_url, link_url, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const allAssets = assets || [];
  const faqAssets = allAssets.filter((a) => a.asset_type === "article" || a.asset_type === "testimonial");
  const activeCount = allAssets.filter((a) => a.is_active).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-green">Support</span>
        </h1>
        <p className="text-sm text-text-secondary">
          Kelola FAQ, kontak, dan konten support yang ditampilkan di portal pengguna.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Aset", value: allAssets.length, color: "text-text-primary", bg: "bg-bg-secondary" },
          { label: "Aktif", value: activeCount, color: "text-accent", bg: "bg-accent/5" },
          { label: "Nonaktif", value: allAssets.length - activeCount, color: "text-text-tertiary", bg: "bg-bg-secondary" },
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

      {/* Info banner */}
      <div
        className="flex items-center gap-2 px-4 py-3 bg-info/5 border border-info/15 text-xs text-info"
        style={{ clipPath: "polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)" }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Gunakan tipe &quot;article&quot; untuk FAQ, &quot;testimonial&quot; untuk testimoni pengguna, &quot;banner&quot; untuk banner promosi, dan &quot;pop_up&quot; untuk pop-up notifikasi.
      </div>

      <AssetForm />

      <AssetTable assets={faqAssets.length > 0 ? faqAssets : allAssets} />
    </div>
  );
}
