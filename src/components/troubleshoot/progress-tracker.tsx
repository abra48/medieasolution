"use client";

import { useTroubleshoot, getPlatformBrand } from "@/lib/troubleshoot-context";

export function ProgressTracker() {
  const { currentStep, selectedPlatform } = useTroubleshoot();

  const STEPS = [
    { key: "platform" as const, label: "Platform", number: 1, icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    )},
    { key: "issue" as const, label: "Masalah", number: 2, icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    )},
    { key: "solution" as const, label: "Solusi", number: 3, icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ];

  const stepOrder = { platform: 1, issue: 2, solution: 3 };
  const currentNum = stepOrder[currentStep];
  const brand = selectedPlatform ? getPlatformBrand(selectedPlatform.name) : null;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-1.5 p-1.5 bg-bg-secondary/80 backdrop-blur-sm rounded-2xl border border-border-subtle shadow-sm">
        {STEPS.map((s, i) => {
          const isActive = currentNum >= s.number;
          const isCurrent = currentNum === s.number;
          const isPast = currentNum > s.number;

          // Use platform brand color for past/current steps when platform is selected
          const activeColor = brand && (isCurrent || isPast) ? brand.primary : undefined;

          return (
            <div key={s.key} className="flex items-center gap-1.5 flex-1">
              <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1 transition-all duration-500 ${
                  isCurrent
                    ? "shadow-sm"
                    : isPast
                    ? "bg-bg-tertiary/50"
                    : "opacity-35"
                }`}
                style={{
                  ...(isCurrent ? {
                    backgroundColor: activeColor ? `${activeColor}12` : 'rgba(16,185,129,0.1)',
                    border: `1px solid ${activeColor ? `${activeColor}40` : 'rgba(16,185,129,0.25)'}`,
                    boxShadow: `0 0 16px ${activeColor ? `${activeColor}15` : 'rgba(16,185,129,0.1)'}`,
                  } : {}),
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                    !isActive ? "bg-bg-tertiary text-text-tertiary" : ""
                  }`}
                  style={{
                    ...(isCurrent ? {
                      backgroundColor: activeColor || '#10b981',
                      color: '#ffffff',
                      boxShadow: `0 0 10px ${activeColor ? `${activeColor}60` : 'rgba(16,185,129,0.4)'}`,
                      transform: 'scale(1.1)',
                    } : isPast ? {
                      backgroundColor: `${activeColor || '#10b981'}30`,
                      color: activeColor || '#10b981',
                    } : {}),
                  }}
                >
                  {isPast ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.icon
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-semibold transition-all duration-500 ${
                      !isActive ? "text-text-tertiary" : ""
                    }`}
                    style={{
                      ...(isCurrent ? { color: activeColor || '#10b981' } : isPast ? { color: 'var(--text-secondary)' } : {}),
                    }}
                  >
                    {s.label}
                  </span>
                  {/* Show selected platform name in issue/solution steps */}
                  {isPast && s.key === "platform" && selectedPlatform && (
                    <span
                      className="text-[9px] font-medium truncate max-w-[80px] transition-all duration-300"
                      style={{ color: activeColor || '#10b981' }}
                    >
                      {selectedPlatform.name}
                    </span>
                  )}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex items-center px-0.5">
                  <div
                    className="w-6 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: currentNum > s.number
                        ? `${activeColor || '#10b981'}60`
                        : 'var(--border-subtle)',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
