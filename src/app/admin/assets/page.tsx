import { createClient } from "@/lib/supabase/server";
import { AssetTable } from "./asset-table";

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_type, title, description, content, image_url, link_url, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  // Foto langkah landing dikelola dari menu Gallery
  const allAssets = (assets || []).filter((a) => !(a.asset_type === "service" && a.title?.startsWith("step-")));
  const activeCount = allAssets.filter((a) => a.is_active).length;

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <p className="mx-label mb-2">Konten web</p>
        <h1 className="mx-title text-3xl mb-1">Aset</h1>
        <p className="text-sm" style={{ color: "var(--p-muted)" }}>
          Artikel/FAQ dukungan, testimonial, banner, dan pop-up. {allAssets.length} aset · {activeCount} aktif.
        </p>
      </div>

      <AssetTable assets={allAssets} />
    </div>
  );
}
