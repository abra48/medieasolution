"use client";

import { TroubleshootProvider, useTroubleshoot, type Platform } from "@/lib/troubleshoot-context";
import { ProgressTracker } from "./progress-tracker";
import { PlatformGrid } from "./platform-grid";
import { IssueSelector } from "./issue-selector";
import { SolutionViewer } from "./solution-viewer";

/* ——— Inner flow (must be inside TroubleshootProvider) ——— */
function TroubleshootFlowInner({ platforms }: { platforms: Platform[] }) {
  const { currentStep } = useTroubleshoot();

  return (
    <div className="space-y-8">
      {/* Progress Tracker */}
      <div
        className="bg-bg-secondary border border-border-default px-6 py-5"
        style={{
          clipPath: "polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)",
        }}
      >
        <ProgressTracker />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === "platform" && <PlatformGrid platforms={platforms} />}
        {currentStep === "issue" && <IssueSelector />}
        {currentStep === "solution" && <SolutionViewer />}
      </div>
    </div>
  );
}

/* ——— Public wrapper (provides context) ——— */
export function TroubleshootFlow({ platforms }: { platforms: Platform[] }) {
  return (
    <TroubleshootProvider>
      <TroubleshootFlowInner platforms={platforms} />
    </TroubleshootProvider>
  );
}
