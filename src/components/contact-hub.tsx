"use client";

import { useState } from "react";

const CONTACT_CHANNELS = [
  {
    id: "whatsapp",
    label: "Navigasi ke WA",
    description: "Kirim pesan langsung ke agen kami melalui WhatsApp.",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: "#25D366",
    href: "https://wa.me/6281234567890",
  },
  {
    id: "email",
    label: "Kirim Email",
    description: "Hubungi agen melalui email untuk bantuan detail.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    color: "#3B82F6",
    href: "mailto:support@medieasolution.com",
  },
  {
    id: "instagram",
    label: "DM Instagram",
    description: "Kirim pesan melalui Instagram untuk respon cepat.",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "#E4405F",
    href: "https://instagram.com/medieasolution",
  },
];

export function ContactHub() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center bg-accent-gold/15 text-accent-gold"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Hubungi Agen</h3>
          <p className="text-sm text-text-secondary">
            Pilih saluran komunikasi untuk menghubungi tim kami.
          </p>
        </div>
      </div>

      {/* Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CONTACT_CHANNELS.map((channel) => (
          <a
            key={channel.id}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredId(channel.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative bg-bg-primary border border-border-default
                       transition-all duration-300
                       hover:shadow-[0_0_24px_rgba(57,255,20,0.08),0_4px_16px_rgba(0,0,0,0.3)]
                       active:scale-[0.97]"
            style={{
              clipPath: "polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%)",
              borderColor: hoveredId === channel.id ? channel.color : undefined,
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              style={{ background: channel.color }}
            />

            {/* 3D inset shadow */}
            <div className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.02)",
              }}
            />

            <div className="px-5 py-5 flex flex-col items-center text-center gap-3">
              {/* Icon */}
              <div
                className="w-14 h-14 flex items-center justify-center border transition-all duration-300"
                style={{
                  backgroundColor: `${channel.color}10`,
                  borderColor: `${channel.color}30`,
                  color: channel.color,
                  clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                }}
              >
                {channel.icon}
              </div>

              {/* Label */}
              <p
                className="text-sm font-bold transition-colors duration-300"
                style={{ color: hoveredId === channel.id ? channel.color : "var(--text-primary)" }}
              >
                {channel.label}
              </p>

              {/* Description */}
              <p className="text-xs text-text-tertiary leading-relaxed">
                {channel.description}
              </p>

              {/* CTA */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 mt-1 text-[10px] font-semibold uppercase tracking-wider
                           transition-all duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: `${channel.color}15`,
                  color: channel.color,
                  clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
                }}
              >
                Kirim Pesan
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Operating hours note */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 bg-bg-secondary/50 border border-border-subtle text-xs text-text-tertiary"
        style={{
          clipPath: "polygon(0 3px, 3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%)",
        }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Waktu operasional: Senin — Jumat, 09:00 — 17:00 WIB
      </div>
    </div>
  );
}
