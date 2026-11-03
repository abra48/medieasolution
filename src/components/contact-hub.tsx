"use client";

import { useI18n } from "@/lib/i18n";

type ContactSettings = {
  phone: string;
  website: string;
  whatsapp_url: string;
  telegram_url: string;
};

export type FaqItem = { id: string; q: string; a: string };

function ArrowUpRight() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
      <path d="M4.5 11.5l7-7M6 4.5h5.5V10" strokeLinecap="square" />
    </svg>
  );
}

export function ContactHub({ settings }: { settings: ContactSettings }) {
  const { t } = useI18n();

  const contacts = [
    { label: "WhatsApp", detail: settings.phone, desc: t("support.wa.desc"), url: settings.whatsapp_url },
    { label: "Telegram", detail: settings.telegram_url.replace(/^https?:\/\//, ""), desc: t("support.tg.desc"), url: settings.telegram_url },
    {
      label: "Website",
      detail: settings.website.replace(/^https?:\/\//, ""),
      desc: t("support.web.desc"),
      url: settings.website.startsWith("http") ? settings.website : `https://${settings.website}`,
    },
  ];

  return (
    <section>
      <p className="mx-label mb-4">{t("support.contact")}</p>
      <div className="mx-list">
        {contacts.map((c, i) => (
          <a key={c.label} href={c.url} target="_blank" rel="noopener noreferrer" className="mx-row">
            <span className="mx-num w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1">
              <span className="mx-row-title block">{c.label}</span>
              <span className="mx-row-desc block">{c.desc}</span>
            </span>
            <span className="hidden sm:block text-xs font-mono truncate max-w-[220px]" style={{ color: "var(--p-muted)" }}>
              {c.detail}
            </span>
            <span className="mx-row-arrow"><ArrowUpRight /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

export function SupportFaq({ items }: { items: FaqItem[] }) {
  const { t } = useI18n();
  const faq: FaqItem[] = items.length
    ? items
    : [1, 2, 3, 4].map((n) => ({ id: `faq-${n}`, q: t(`support.faq${n}.q`), a: t(`support.faq${n}.a`) }));

  return (
    <section>
      <p className="mx-label mb-4">{t("support.faq")}</p>
      <div className="mx-list">
        {faq.map((item, i) => (
          <details key={item.id} className="group" style={{ borderBottom: "1px solid var(--p-border)" }}>
            <summary className="flex items-baseline gap-5 py-5 px-1 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="mx-num w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="mx-row-title flex-1">{item.q}</span>
              <span className="mx-num transition-transform duration-200 group-open:rotate-45 text-base leading-none" aria-hidden>+</span>
            </summary>
            <p className="mx-row-desc pb-5 pl-[52px] pr-8 whitespace-pre-line">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
