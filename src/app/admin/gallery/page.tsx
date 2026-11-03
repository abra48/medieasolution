import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdminSeniorOrAbove } from "@/lib/admin-roles";
import { LANDING_STEP_COUNT } from "@/lib/landing-steps";
import { GalleryManager } from "./gallery-manager";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  const canEdit = isAdminSeniorOrAbove(profile?.role);

  const { data: stepRows } = await supabase
    .from("assets")
    .select("title, image_url")
    .eq("asset_type", "service")
    .like("title", "step-%");

  const stepImages: Record<number, string> = {};
  for (const row of stepRows ?? []) {
    const step = Number(String(row.title).replace("step-", ""));
    if (step >= 1 && step <= LANDING_STEP_COUNT && row.image_url) stepImages[step] = row.image_url;
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <p className="mx-label mb-2">Media</p>
        <h1 className="mx-title text-3xl mb-1">Galeri</h1>
        <p className="text-sm" style={{ color: "var(--p-muted)" }}>
          Simpan foto di satu tempat, lalu pakai untuk foto langkah &ldquo;Cara Kerja&rdquo; di halaman depan.
        </p>
      </div>

      <GalleryManager initialStepImages={stepImages} canEdit={canEdit} stepCount={LANDING_STEP_COUNT} />
    </div>
  );
}
