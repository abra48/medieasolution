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
    <div className="space-y-10">
      {/* Global error banner */}
      {error && (
        <div className="mx-notice mx-notice-error flex items-center gap-3">
          <span className="flex-1">{error}</span>
          <button type="button" onClick={clearError} className="mx-link" aria-label="Tutup">×</button>
        </div>
      )}

      <ProgressTracker />

      {/* Page container */}
      <div className="min-h-[300px]">
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
