import { createClient } from "@/lib/supabase/server";
import { SolutionsManager } from "./solutions-manager";

export default async function SolutionsPage() {
  const supabase = await createClient();

  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="mx-label mb-2">Konten panduan</p>
        <h1 className="mx-title text-3xl mb-1">Langkah solusi</h1>
        <p className="text-sm" style={{ color: "var(--p-muted)" }}>Pilih platform, lalu bangun langkah-langkah solusi per kendala.</p>
      </div>

      <SolutionsManager platforms={platforms || []} />
    </div>
  );
}
