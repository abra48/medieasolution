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
        <p className="mx-label mb-2">Konten panduan</p>
        <h1 className="mx-title text-3xl mb-1">Kendala</h1>
        <p className="text-sm" style={{ color: "var(--p-muted)" }}>Pilih platform, lalu kelola kendala terdaftar.</p>
      </div>

      <IssuesManager platforms={platforms || []} />
    </div>
  );
}
