import { ContactHub } from "@/components/contact-hub";

export default function SupportPage() {
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
          {[
            { q: "How long does recovery take?", a: "Varies by platform and issue type. Typically 1–7 business days." },
            { q: "Is my data safe?", a: "All data is processed securely and not stored after completion." },
            { q: "How do I get an access code?", a: "Through our official agents via WhatsApp or affiliate distributors." },
            { q: "Is there a success guarantee?", a: "We provide guides based on official platform procedures. Success depends on account conditions." },
          ].map((faq, i) => (
            <div key={i} className="card">
              <p className="text-sm font-medium text-text-primary mb-1">{faq.q}</p>
              <p className="text-xs text-text-tertiary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
