import { createClient } from "@/lib/supabase/server";
import { AssetTable } from "../assets/asset-table";
import { ContactSettings } from "./contact-settings";

export default async function AdminSupportPage() {
  const supabase = await createClient();

  const { data: assets } = await supabase
    .from("assets")
    .select("id, asset_type, title, description, content, image_url, link_url, is_active, created_at")
    .eq("asset_type", "article")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <p className="mx-label mb-2">Portal pengguna</p>
        <h1 className="mx-title text-3xl mb-1">Dukungan</h1>
        <p className="text-sm" style={{ color: "var(--p-muted)" }}>
          Kontak dan FAQ yang tampil di halaman Dukungan. FAQ memakai tipe &ldquo;Artikel / FAQ&rdquo;: judul = pertanyaan, konten = jawaban.
        </p>
      </div>

      <ContactSettings />

      <AssetTable assets={assets || []} />
    </div>
  );
}
