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
        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Manajemen <span className="text-gradient-green">Panduan</span>
        </h1>
        <p className="text-sm text-text-secondary">Pilih platform, lalu bangun langkah-langkah solusi per kendala.</p>
      </div>

      <SolutionsManager platforms={platforms || []} />
    </div>
  );
}
