import { createClient } from "@/lib/supabase/server";
import { PlatformForm } from "./platform-form";
import { PlatformTable } from "./platform-table";

export default async function PlatformsPage() {
  const supabase = await createClient();
  const { data: platforms } = await supabase
    .from("platforms")
    .select("id, name, icon_url, status, created_at")
    .order("name");

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <p className="mx-label mb-2">Konten panduan</p>
        <h1 className="mx-title text-3xl mb-1">Platform</h1>
        <p className="text-sm" style={{ color: "var(--p-muted)" }}>Tambah, ubah, dan hapus platform media sosial.</p>
      </div>

      <section>
        <div className="mx-section-head">
          <h2 className="mx-subtitle">Tambah platform</h2>
        </div>
        <PlatformForm />
      </section>

      <section>
        <div className="mx-section-head">
          <h2 className="mx-subtitle">Platform terdaftar</h2>
          <span className="mx-num">{platforms?.length ?? 0} platform</span>
        </div>
        <PlatformTable platforms={platforms || []} />
      </section>
    </div>
  );
}
