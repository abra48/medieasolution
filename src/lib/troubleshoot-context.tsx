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
  error: string | null;
  selectPlatform: (platform: Platform) => void;
  selectIssue: (issue: Issue) => void;
  goBack: () => void;
  reset: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
};

/* ——— Platform Brand Colors ——— */
export const PLATFORM_BRAND_COLORS: Record<string, { primary: string; gradient: string }> = {
  facebook: { primary: "#1877F2", gradient: "linear-gradient(135deg, #1877F2, #42A5F5)" },
  instagram: { primary: "#E4405F", gradient: "linear-gradient(135deg, #F58529, #DD2A7B, #8134AF, #515BD4)" },
  tiktok: { primary: "#00F2EA", gradient: "linear-gradient(135deg, #00F2EA, #FF0050)" },
  "twitter / x": { primary: "#000000", gradient: "linear-gradient(135deg, #1DA1F2, #0D8BD9)" },
  twitter: { primary: "#1DA1F2", gradient: "linear-gradient(135deg, #1DA1F2, #0D8BD9)" },
  youtube: { primary: "#FF0000", gradient: "linear-gradient(135deg, #FF0000, #CC0000)" },
  whatsapp: { primary: "#25D366", gradient: "linear-gradient(135deg, #25D366, #128C7E)" },
  telegram: { primary: "#26A5E4", gradient: "linear-gradient(135deg, #26A5E4, #0088CC)" },
  linkedin: { primary: "#0A66C2", gradient: "linear-gradient(135deg, #0A66C2, #004182)" },
};

export function getPlatformBrand(name: string) {
  const key = name.trim().toLowerCase();
  return PLATFORM_BRAND_COLORS[key] || { primary: "#10b981", gradient: "linear-gradient(135deg, #10b981, #059669)" };
}

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
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>("none");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const setError = useCallback((err: string | null) => {
    setErrorState(err);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const triggerTransition = useCallback(
    (direction: TransitionDirection, callback: () => void, delay = 300) => {
      if (isTransitioning) return; // Prevent double-transitions
      setTransitionDirection(direction);
      setIsTransitioning(true);
      setErrorState(null); // Clear errors on navigation
      setTimeout(() => {
        callback();
        setIsTransitioning(false);
      }, delay);
    },
    [isTransitioning]
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
        error,
        selectPlatform,
        selectIssue,
        goBack,
        reset,
        setError,
        clearError,
      }}
    >
      {children}
    </TroubleshootContext.Provider>
  );
}
