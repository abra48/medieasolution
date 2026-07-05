"use client";

import { TroubleshootProvider } from "@/lib/troubleshoot-context";
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

export function TroubleshootFlow({ platforms }: { platforms: Platform[] }) {
  return (
    <TroubleshootProvider>
      <div className="space-y-6">
        <ProgressTracker />
        <PlatformGrid platforms={platforms} />
        <IssueSelector />
        <SolutionViewer />
      </div>
    </TroubleshootProvider>
  );
}
