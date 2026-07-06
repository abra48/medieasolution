"use client";

import { useState, useEffect } from "react";
import { getContactSettings } from "@/app/actions/contact";

export function ContactHub() {
  const [contacts, setContacts] = useState([
    {
      label: "WhatsApp",
      description: "Chat langsung dengan tim pemulihan kami.",
      url: "https://wa.me/6281241511156",
      color: "#25D366",
    },
    {
      label: "Telegram",
      description: "Hubungi kami via Telegram untuk bantuan.",
      url: "https://t.me/medieasolution",
      color: "#26A5E4",
    },
    {
      label: "Website",
      description: "Kunjungi website resmi kami.",
      url: "https://mediea.co.id",
      color: "#10b981",
    },
  ]);

  useEffect(() => {
    getContactSettings().then((settings) => {
      setContacts([
        {
          label: "WhatsApp",
          description: `Chat langsung — ${settings.phone}`,
          url: settings.whatsapp_url,
          color: "#25D366",
        },
        {
          label: "Telegram",
          description: "Hubungi kami via Telegram untuk bantuan.",
          url: settings.telegram_url,
          color: "#26A5E4",
        },
        {
          label: "Website",
          description: settings.website,
          url: settings.website.startsWith("http") ? settings.website : `https://${settings.website}`,
          color: "#10b981",
        },
      ]);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {contacts.map((contact) => (
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
