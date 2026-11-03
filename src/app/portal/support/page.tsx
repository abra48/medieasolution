import { createClient } from "@/lib/supabase/server";
import { ContactHub, SupportFaq } from "@/components/contact-hub";
import { SupportHeader } from "@/components/portal-headers";
import { getContactSettings } from "@/app/actions/contact";

export default async function SupportPage() {
  const supabase = await createClient();

  // FAQ dinamis dari Aset (tipe "Artikel / FAQ"); kosong = pakai FAQ bawaan
  const [{ data: faqAssets }, settings] = await Promise.all([
    supabase
      .from("assets")
      .select("id, title, description, content")
      .eq("asset_type", "article")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(20),
    getContactSettings(),
  ]);

  const faq = (faqAssets ?? []).map((f) => ({
    id: f.id,
    q: f.title || "FAQ",
    a: f.content || f.description || "",
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-14 animate-fade-in">
      <SupportHeader />
      <ContactHub settings={settings} />
      <SupportFaq items={faq} />
    </div>
  );
}
