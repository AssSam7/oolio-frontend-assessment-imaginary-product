import { createContext, useContext } from "react";
import type { AssessmentRoutePath, ProgressItem } from "./types";

export interface AssessmentContextType {
  progress: Record<AssessmentRoutePath, ProgressItem>;
  markProblemIdentified: (path: AssessmentRoutePath) => void;
  markProblemResolved: (path: AssessmentRoutePath) => void;
  getProgressPercentage: (path: AssessmentRoutePath) => number;
}

export const AssessmentProgressContext =
  createContext<AssessmentContextType | null>(null);

export const useAssessmentProgress = () => {
  const context = useContext(AssessmentProgressContext);

  if (!context) {
    throw new Error(
      "useAssessmentProgress must be used within AssessmentProgressProvider"
    );
  }

  return context;
};
