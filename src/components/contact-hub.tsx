"use client";

export function ContactHub() {
  const CONTACTS = [
    {
      label: "WhatsApp",
      description: "Chat directly with our recovery team.",
      url: "https://wa.me/6281234567890",
      color: "#25D366",
    },
    {
      label: "Telegram",
      description: "Reach us via Telegram for support.",
      url: "https://t.me/medieasolution",
      color: "#26A5E4",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {CONTACTS.map((contact) => (
        <a
          key={contact.label}
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card flex items-center gap-4 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${contact.color}15`, border: `1px solid ${contact.color}30` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: contact.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
              {contact.label}
            </p>
            <p className="text-xs text-text-tertiary">{contact.description}</p>
          </div>
          <svg className="w-4 h-4 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ))}
    </div>
  );
}
