import { createClient } from "@/lib/supabase/server";
import { ContactHub } from "@/components/contact-hub";

export default async function SupportPage() {
  const supabase = await createClient();

  // Try to fetch FAQ assets from database
  const { data: faqAssets } = await supabase
    .from("assets")
    .select("id, title, description, content, is_active")
    .eq("asset_type", "article")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const hasDynamicFaq = faqAssets && faqAssets.length > 0;

  // Fallback static FAQ if no assets found
  const staticFaq = [
    { q: "How long does recovery take?", a: "Varies by platform and issue type. Typically 1–7 business days." },
    { q: "Is my data safe?", a: "All data is processed securely and not stored after completion." },
    { q: "How do I get an access code?", a: "Through our official agents via WhatsApp or affiliate distributors." },
    { q: "Is there a success guarantee?", a: "We provide guides based on official platform procedures. Success depends on account conditions." },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary mb-1">Support</h1>
        <p className="text-sm text-text-tertiary">Contact our team for account recovery assistance.</p>
      </div>

      <ContactHub />

      <div>
        <p className="text-xs text-text-tertiary uppercase tracking-wider mb-3">FAQ</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hasDynamicFaq
            ? faqAssets.map((faq) => (
                <div key={faq.id} className="card">
                  <p className="text-sm font-medium text-text-primary mb-1">{faq.title || "FAQ"}</p>
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    {faq.description || faq.content}
                  </p>
                </div>
              ))
            : staticFaq.map((faq, i) => (
                <div key={i} className="card">
                  <p className="text-sm font-medium text-text-primary mb-1">{faq.q}</p>
                  <p className="text-xs text-text-tertiary leading-relaxed">{faq.a}</p>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
