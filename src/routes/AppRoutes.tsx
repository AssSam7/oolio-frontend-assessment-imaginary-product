import { Routes, Route } from "react-router-dom";

import ScrollToTop from "@/components/common/ScrollToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AssessmentProgressProvider } from "@/components/ui/AssessmentProgress";

import { appRoutes } from "./routeConfig";
import MainLayout from "@/layouts/MainLayout";

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <AssessmentProgressProvider>
        <ScrollToTop />

        <Routes>
          {/* Layout wrapper */}
          <Route element={<MainLayout />}>
            {appRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </AssessmentProgressProvider>
    </ErrorBoundary>
  );
};

export default AppRoutes;
