"use client";

import React, { useState } from "react";
import { useTroubleshoot } from "@/lib/troubleshoot-context";

type Platform = {
  id: string;
  name: string;
  icon_url: string | null;
  status: string;
};

/* Platform icons as SVG for when icon_url is not available */
const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  ),
};

function getPlatformColor(name: string): string {
  const colors: Record<string, string> = {
    facebook: "#1877F2",
    instagram: "#E4405F",
    tiktok: "#000000",
    "twitter / x": "#1DA1F2",
    twitter: "#1DA1F2",
    youtube: "#FF0000",
    whatsapp: "#25D366",
    telegram: "#26A5E4",
    linkedin: "#0A66C2",
  };
  return colors[name.toLowerCase()] || "#10b981";
}

function getPlatformGradient(name: string): string {
  const color = getPlatformColor(name);
  return `radial-gradient(circle at 30% 30%, ${color}12, transparent 70%)`;
}

export function PlatformGrid({ platforms }: { platforms: Platform[] }) {
  const { currentStep, selectPlatform, selectedPlatform } = useTroubleshoot();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (currentStep !== "platform") return null;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">Langkah 1 dari 3</span>
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-1">Pilih Platform</h2>
        <p className="text-sm text-text-tertiary">Pilih akun media sosial yang perlu dipulihkan.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {platforms.map((platform, i) => {
          const isSelected = selectedPlatform?.id === platform.id;
          const isHovered = hoveredId === platform.id;
          const color = getPlatformColor(platform.name);
          const icon = PLATFORM_ICONS[platform.name.toLowerCase()];

          return (
            <button
              key={platform.id}
              onClick={() => selectPlatform(platform)}
              onMouseEnter={() => setHoveredId(platform.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`ts-card-stagger group relative text-left p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                isSelected
                  ? "border-accent bg-accent/5 shadow-[0_0_24px_rgba(16,185,129,0.12)] glow-pulse"
                  : "border-border-subtle bg-bg-secondary hover:border-text-tertiary"
              }`}
              style={{
                animationDelay: `${i * 80}ms`,
                borderColor: isHovered && !isSelected ? `${color}40` : undefined,
              }}
            >
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: getPlatformGradient(platform.name) }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  {platform.icon_url ? (
                    <img
                      src={platform.icon_url}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : icon ? (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        color,
                        opacity: 0.8,
                        backgroundColor: `${color}08`,
                      }}
                    >
                      {icon}
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        backgroundColor: color,
                        boxShadow: isHovered ? `0 4px 16px ${color}30` : "none",
                      }}
                    >
                      {platform.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-text-primary block group-hover:text-accent transition-colors duration-300">
                  {platform.name}
                </span>
                <span className="text-[11px] text-text-tertiary mt-1 block">
                  Pemulihan akun
                </span>
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
