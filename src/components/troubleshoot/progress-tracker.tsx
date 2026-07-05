"use client";

import { useTroubleshoot } from "@/lib/troubleshoot-context";

export function ProgressTracker() {
  const { currentStep } = useTroubleshoot();

  const STEPS = [
    { key: "platform" as const, label: "Platform", number: 1 },
    { key: "issue" as const, label: "Issue", number: 2 },
    { key: "solution" as const, label: "Solution", number: 3 },
  ];

  const stepOrder = { platform: 1, issue: 2, solution: 3 };
  const currentNum = stepOrder[currentStep];

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                currentNum >= s.number
                  ? "bg-accent text-text-inverse"
                  : "bg-bg-tertiary text-text-tertiary"
              }`}
            >
              {s.number}
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                currentNum >= s.number ? "text-text-primary" : "text-text-tertiary"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 h-px transition-colors ${
                currentNum > s.number ? "bg-accent" : "bg-border-default"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
