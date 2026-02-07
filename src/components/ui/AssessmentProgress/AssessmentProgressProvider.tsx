import { useState, type ReactNode } from "react";
import { AssessmentProgressContext } from "./assessmentProgress.context";
import type { AssessmentRoutePath, ProgressItem } from "./types";

const initialProgress: Record<AssessmentRoutePath, ProgressItem> = {
  "/dashboard": { identified: 0, resolved: 0, total: 8 },
  "/products": { identified: 0, resolved: 0, total: 6 },
  "/shopping-cart": { identified: 0, resolved: 0, total: 7 },
  "/user-authentication": { identified: 0, resolved: 0, total: 5 },
};

export const AssessmentProgressProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [progress, setProgress] = useState(initialProgress);

  const markProblemIdentified = (path: AssessmentRoutePath) => {
    setProgress((prev) => {
      const item = prev[path];
      return {
        ...prev,
        [path]: {
          ...item,
          identified: Math.min(item.identified + 1, item.total),
        },
      };
    });
  };

  const markProblemResolved = (path: AssessmentRoutePath) => {
    setProgress((prev) => {
      const item = prev[path];
      return {
        ...prev,
        [path]: {
          ...item,
          resolved: Math.min(item.resolved + 1, item.total),
        },
      };
    });
  };

  const getProgressPercentage = (path: AssessmentRoutePath) => {
    const item = progress[path];
    return Math.round((item.resolved / item.total) * 100);
  };

  return (
    <AssessmentProgressContext.Provider
      value={{
        progress,
        markProblemIdentified,
        markProblemResolved,
        getProgressPercentage,
      }}
    >
      {children}
    </AssessmentProgressContext.Provider>
  );
};
