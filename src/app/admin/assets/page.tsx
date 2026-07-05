import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "./asset-form";
import { AssetTable } from "./asset-table";

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_type, title, description, content, image_url, link_url, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const allAssets = assets || [];
  const activeCount = allAssets.filter((a) => a.is_active).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Aset <span className="text-gradient-gold">Web</span>
        </h1>
        <p className="text-sm text-text-secondary">
          Kelola artikel, testimonial, banner, pop-up, dan konten pemasaran lainnya.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Aset", value: allAssets.length, color: "text-text-primary", bg: "bg-bg-secondary" },
          { label: "Aktif", value: activeCount, color: "text-accent-green", bg: "bg-accent-green/5" },
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

      <AssetForm />

      <AssetTable assets={allAssets} />
    </div>
  );
}
