"use client";

import { useTroubleshoot, getPlatformBrand } from "@/lib/troubleshoot-context";

export function ProgressTracker() {
  const { currentStep, selectedPlatform } = useTroubleshoot();

  const STEPS = [
    { key: "platform" as const, label: "Platform", number: 1 },
    { key: "issue" as const, label: "Masalah", number: 2 },
    { key: "solution" as const, label: "Solusi", number: 3 },
  ];

  const stepOrder = { platform: 1, issue: 2, solution: 3 };
  const currentNum = stepOrder[currentStep];
  const brand = selectedPlatform ? getPlatformBrand(selectedPlatform.name) : null;
  const activeColor = brand?.primary || "#10b981";

  return (
    <div className="flex items-center gap-2 p-1.5 bg-bg-secondary rounded-xl border border-border-subtle">
      {STEPS.map((s, i) => {
        const isCurrent = currentNum === s.number;
        const isPast = currentNum > s.number;
        const isActive = isCurrent || isPast;

        return (
          <div key={s.key} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-1 transition-all duration-300 ${
                isCurrent
                  ? "border"
                  : isPast
                  ? "bg-bg-tertiary/50"
                  : "opacity-30"
              }`}
              style={isCurrent ? {
                backgroundColor: `${activeColor}08`,
                borderColor: `${activeColor}25`,
              } : {}}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300 ${
                  !isActive ? "bg-bg-tertiary text-text-tertiary" : ""
                }`}
                style={isCurrent ? {
                  backgroundColor: activeColor,
                  color: '#fff',
                } : isPast ? {
                  backgroundColor: `${activeColor}20`,
                  color: activeColor,
                } : {}}
              >
                {isPast ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.number
                )}
              </span>

              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[11px] font-semibold transition-colors duration-300 ${
                    !isActive ? "text-text-tertiary" : ""
                  }`}
                  style={isCurrent ? { color: activeColor } : isPast ? { color: 'var(--text-secondary)' } : {}}
                >
                  {s.label}
                </span>
                {isPast && s.key === "platform" && selectedPlatform && (
                  <span
                    className="text-[9px] font-medium truncate max-w-[80px]"
                    style={{ color: activeColor }}
                  >
                    {selectedPlatform.name}
                  </span>
                )}
              </div>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className="w-4 h-px rounded-full shrink-0 transition-colors duration-300"
                style={{
                  backgroundColor: currentNum > s.number
                    ? `${activeColor}50`
                    : 'var(--border-subtle)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
