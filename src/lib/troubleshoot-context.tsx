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
  issue_name: string;
  description: string | null;
};

export type TroubleshootStep = "platform" | "issue" | "solution";
export type TransitionDirection = "forward" | "backward" | "none";

type TroubleshootState = {
  currentStep: TroubleshootStep;
  selectedPlatform: Platform | null;
  selectedIssue: Issue | null;
  transitionDirection: TransitionDirection;
  isTransitioning: boolean;
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
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("none");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback(
    (
      direction: TransitionDirection,
      callback: () => void,
      delay = 350
    ) => {
      setTransitionDirection(direction);
      setIsTransitioning(true);
      // Wait for exit animation, then switch step
      setTimeout(() => {
        callback();
        setIsTransitioning(false);
      }, delay);
    },
    []
  );

  const selectPlatform = useCallback(
    (platform: Platform) => {
      triggerTransition("forward", () => {
        setSelectedPlatform(platform);
        setSelectedIssue(null);
        setCurrentStep("issue");
      });
    },
    [triggerTransition]
  );

  const selectIssue = useCallback(
    (issue: Issue) => {
      triggerTransition("forward", () => {
        setSelectedIssue(issue);
        setCurrentStep("solution");
      });
    },
    [triggerTransition]
  );

  const goBack = useCallback(() => {
    triggerTransition("backward", () => {
      if (currentStep === "solution") {
        setSelectedIssue(null);
        setCurrentStep("issue");
      } else if (currentStep === "issue") {
        setSelectedPlatform(null);
        setCurrentStep("platform");
      }
    });
  }, [currentStep, triggerTransition]);

  const reset = useCallback(() => {
    triggerTransition("backward", () => {
      setSelectedPlatform(null);
      setSelectedIssue(null);
      setCurrentStep("platform");
    });
  }, [triggerTransition]);

  return (
    <TroubleshootContext.Provider
      value={{
        currentStep,
        selectedPlatform,
        selectedIssue,
        transitionDirection,
        isTransitioning,
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
