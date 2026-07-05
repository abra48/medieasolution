"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ——— Types ——— */
export type Platform = {
  id: string;
  name: string;
  icon_url: string | null;
  status: string;
};

export type Issue = {
  id: string;
  platform_id: string;
  issue_name: string;
  description: string | null;
};

export type TroubleshootStep = "platform" | "issue" | "solution";

type TroubleshootState = {
  currentStep: TroubleshootStep;
  selectedPlatform: Platform | null;
  selectedIssue: Issue | null;
  selectPlatform: (platform: Platform) => void;
  selectIssue: (issue: Issue) => void;
  goBack: () => void;
  reset: () => void;
};

/* ——— Context ——— */
const TroubleshootContext = createContext<TroubleshootState | null>(null);

export function useTroubleshoot() {
  const ctx = useContext(TroubleshootContext);
  if (!ctx) {
    throw new Error(
      "useTroubleshoot must be used within a TroubleshootProvider"
    );
  }
  return ctx;
}

/* ——— Provider ——— */
export function TroubleshootProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<TroubleshootStep>("platform");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const selectPlatform = useCallback((platform: Platform) => {
    setSelectedPlatform(platform);
    setSelectedIssue(null);
    setCurrentStep("issue");
  }, []);

  const selectIssue = useCallback((issue: Issue) => {
    setSelectedIssue(issue);
    setCurrentStep("solution");
  }, []);

  const goBack = useCallback(() => {
    if (currentStep === "solution") {
      setSelectedIssue(null);
      setCurrentStep("issue");
    } else if (currentStep === "issue") {
      setSelectedPlatform(null);
      setCurrentStep("platform");
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setSelectedPlatform(null);
    setSelectedIssue(null);
    setCurrentStep("platform");
  }, []);

  return (
    <TroubleshootContext.Provider
      value={{
        currentStep,
        selectedPlatform,
        selectedIssue,
        selectPlatform,
        selectIssue,
        goBack,
        reset,
      }}
    >
      {children}
    </TroubleshootContext.Provider>
  );
}
