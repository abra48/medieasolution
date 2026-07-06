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
  const { currentStep, transitionDirection, isTransitioning } = useTroubleshoot();

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
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/[0.03] blur-3xl portal-orb-1" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-secondary/[0.03] blur-3xl portal-orb-2" />
      </div>

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
