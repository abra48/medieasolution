import { createClient } from "@/lib/supabase/server";
import { IssuesManager } from "./issues-manager";

export default async function IssuesPage() {
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
          Manajemen <span className="text-gradient-gold">Kendala</span>
        </h1>
        <p className="text-sm text-text-secondary">Pilih platform, lalu kelola kendala terdaftar.</p>
      </div>

      <IssuesManager platforms={platforms || []} />
    </div>
  );
}
