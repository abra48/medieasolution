"use client";

import { useTroubleshoot } from "@/lib/troubleshoot-context";

type Platform = {
  id: string;
  name: string;
  icon_url: string | null;
  status: string;
};

export function PlatformGrid({ platforms }: { platforms: Platform[] }) {
  const { currentStep, selectPlatform, selectedPlatform } = useTroubleshoot();

  if (currentStep !== "platform") return null;

  return (
    <div className="animate-fade-in">
      <p className="text-xs text-text-tertiary mb-3">Select the platform with the affected account.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => selectPlatform(platform)}
            className={`text-left px-4 py-3 rounded-lg border transition-all ${
              selectedPlatform?.id === platform.id
                ? "border-accent bg-accent/5"
                : "border-border-default bg-bg-secondary hover:border-text-tertiary"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {platform.icon_url ? (
                <img
                  src={platform.icon_url}
                  alt=""
                  className="w-5 h-5 rounded object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded bg-bg-tertiary flex items-center justify-center">
                  <span className="text-[9px] font-medium text-text-tertiary">
                    {platform.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-text-primary">
                {platform.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
