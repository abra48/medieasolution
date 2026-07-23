"use client";

import { TroubleshootProvider, useTroubleshoot } from "@/lib/troubleshoot-context";
import { ProgressTracker } from "./progress-tracker";
import { PlatformGrid } from "./platform-grid";
import { IssueSelector } from "./issue-selector";
import { SolutionViewer } from "./solution-viewer";

type Platform = {
  id: string;
  name: string;
  icon_url: string | null;
  status: string;
};

function TroubleshootContent({ platforms }: { platforms: Platform[] }) {
  const { currentStep, transitionDirection, isTransitioning, error, clearError } = useTroubleshoot();

  const getEnterClass = () => {
    if (transitionDirection === "forward") return "page-enter-right";
    if (transitionDirection === "backward") return "page-enter-left";
    return "animate-fade-in";
  };

  const getExitClass = () => {
    if (transitionDirection === "forward") return "page-exit-left";
    if (transitionDirection === "backward") return "page-exit-right";
    return "";
  };

  return (
    <div className="space-y-6 relative">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/[0.02] blur-3xl portal-orb-1" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/[0.02] blur-3xl portal-orb-2" />
      </div>

      {/* Global error banner */}
      {error && (
        <div className="relative z-20 flex items-center gap-3 p-3 rounded-xl bg-danger/5 border border-danger/15 animate-slide-down">
          <svg className="w-4 h-4 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span className="text-xs text-danger flex-1">{error}</span>
          <button onClick={clearError} className="text-danger/60 hover:text-danger transition-colors shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="relative z-10">
        <ProgressTracker />
      </div>

      {/* Animated page container */}
      <div className="relative z-10 min-h-[300px]">
        {isTransitioning && (
          <div key={`exit-${currentStep}`} className={getExitClass()}>
            {currentStep === "platform" && <PlatformGrid platforms={platforms} />}
            {currentStep === "issue" && <IssueSelector />}
            {currentStep === "solution" && <SolutionViewer />}
          </div>
        )}

        {!isTransitioning && (
          <div key={currentStep} className={getEnterClass()}>
            {currentStep === "platform" && <PlatformGrid platforms={platforms} />}
            {currentStep === "issue" && <IssueSelector />}
            {currentStep === "solution" && <SolutionViewer />}
          </div>
        )}
      </div>
    </div>
  );
}

export function TroubleshootFlow({ platforms }: { platforms: Platform[] }) {
  return (
    <TroubleshootProvider>
      <TroubleshootContent platforms={platforms} />
    </TroubleshootProvider>
  );
}
