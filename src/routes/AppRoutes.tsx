import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import ScrollToTop from "@/components/common/ScrollToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AssessmentProgressProvider } from "@/components/ui/AssessmentProgress";

import { appRoutes } from "./routeConfig";

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <AssessmentProgressProvider>
        <ScrollToTop />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {appRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </AssessmentProgressProvider>
    </ErrorBoundary>
  );
};

export default AppRoutes;

/* ---------- Optional Local Loader ---------- */

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
      Loading...
    </div>
  );
};
