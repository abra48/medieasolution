"use client";

import { useTroubleshoot, type Platform } from "@/lib/troubleshoot-context";

/* ——— Platform icon/color mapping ——— */
const PLATFORM_META: Record<string, { icon: string; color: string; brand: string }> = {
  Facebook:      { icon: "f",  color: "#1877F2", brand: "Facebook" },
  Instagram:     { icon: "IG", color: "#E4405F", brand: "Instagram" },
  TikTok:        { icon: "♪",  color: "#00F2EA", brand: "TikTok" },
  "Twitter / X": { icon: "𝕏",  color: "#FFFFFF", brand: "X" },
  YouTube:       { icon: "▶",  color: "#FF0000", brand: "YouTube" },
  WhatsApp:      { icon: "WA", color: "#25D366", brand: "WhatsApp" },
  Telegram:      { icon: "TG", color: "#26A5E4", brand: "Telegram" },
  LinkedIn:      { icon: "in", color: "#0A66C2", brand: "LinkedIn" },
};

function getPlatformMeta(name: string) {
  return PLATFORM_META[name] ?? { icon: name[0], color: "#9CA3AF", brand: name };
}

export function PlatformGrid({ platforms }: { platforms: Platform[] }) {
  const { selectPlatform } = useTroubleshoot();

  return (
    <div className="animate-fade-in">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-1">
          Pilih Platform
        </h2>
        <p className="text-sm text-text-secondary">
          Pilih platform media sosial yang ingin Anda pulihkan akunnya.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {platforms.map((platform) => {
          const meta = getPlatformMeta(platform.name);

          return (
            <button
              key={platform.id}
              onClick={() => selectPlatform(platform)}
              className="group relative bg-bg-primary border border-border-default
                         transition-all duration-300 ease-out
                         hover:border-accent-green
                         hover:shadow-[0_0_24px_rgba(57,255,20,0.12),0_4px_16px_rgba(0,0,0,0.3)]
                         active:scale-[0.97]
                         focus-visible:outline-2 focus-visible:outline-accent-green
                         overflow-hidden"
              style={{
                /* 3D card: sharp edges with slight bevel */
                clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, ${meta.color}, transparent)` }}
              />

              {/* Card Content */}
              <div className="px-4 py-6 flex flex-col items-center gap-4">
                {/* Icon Container — 3D box effect */}
                <div className="relative">
                  <div
                    className="w-16 h-16 flex items-center justify-center text-2xl font-bold
                               border transition-all duration-300
                               group-hover:scale-105 group-hover:shadow-lg"
                    style={{
                      backgroundColor: `${meta.color}10`,
                      borderColor: `${meta.color}25`,
                      color: meta.color,
                      clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                    }}
                  >
                    {meta.icon}
                  </div>
                  {/* Shadow layer for 3D depth */}
                  <div
                    className="absolute -bottom-1 -right-1 w-16 h-16 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                    style={{
                      backgroundColor: meta.color,
                      clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
                      filter: "blur(6px)",
                      zIndex: -1,
                    }}
                  />
                </div>

                {/* Platform Name */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-text-primary group-hover:text-accent-green transition-colors duration-300">
                    {platform.name}
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-0.5 uppercase tracking-wider">
                    Recovery
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#22C55E] animate-pulse" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                  <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>

              {/* Bottom Corner Accent */}
              <div
                className="absolute bottom-0 right-0 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${meta.color}30 50%)`,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
