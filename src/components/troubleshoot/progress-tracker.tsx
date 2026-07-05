"use client";

import { useTroubleshoot, type TroubleshootStep } from "@/lib/troubleshoot-context";

const STEPS: { key: TroubleshootStep; label: string; labelId: string }[] = [
  { key: "platform", label: "Platform", labelId: "Pilih Platform" },
  { key: "issue", label: "Kendala", labelId: "Pilih Kendala" },
  { key: "solution", label: "Solusi", labelId: "Lihat Solusi" },
];

const STEP_ORDER: TroubleshootStep[] = ["platform", "issue", "solution"];

export function ProgressTracker() {
  const { currentStep } = useTroubleshoot();
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="w-full">
      {/* Desktop Progress */}
      <div className="flex items-center justify-between relative">
        {/* Connection Line (background) */}
        <div className="absolute top-5 left-[calc(16.67%)] right-[calc(16.67%)] h-px bg-border-default" />
        {/* Connection Line (active) */}
        <div
          className="absolute top-5 left-[calc(16.67%)] h-px bg-accent-green transition-all duration-500 ease-out"
          style={{
            width:
              currentIndex === 0
                ? "0%"
                : currentIndex === 1
                ? "calc(33.33%)"
                : "calc(66.67%)",
          }}
        />

        {STEPS.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10 flex-1"
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-accent-green text-text-inverse"
                    : isActive
                    ? "bg-accent-gold text-text-inverse shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                    : "bg-bg-secondary text-text-tertiary border border-border-default"
                }`}
                style={{ clipPath: "polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)" }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isActive
                      ? "text-accent-gold"
                      : isCompleted
                      ? "text-accent-green"
                      : "text-text-tertiary"
                  }`}
                >
                  Step {index + 1}
                </p>
                <p
                  className={`text-sm font-medium mt-0.5 transition-colors duration-300 ${
                    isActive
                      ? "text-text-primary"
                      : isCompleted
                      ? "text-text-secondary"
                      : "text-text-tertiary"
                  }`}
                >
                  {step.labelId}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
