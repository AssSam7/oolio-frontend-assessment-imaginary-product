import { Outlet } from "react-router-dom";
import AppHeader from "@/components/ui/AppHeader";
import { Suspense } from "react";
import PageLoader from "@/components/common/PageLoader";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import SnackbarContainer from "@/components/ui/SnackbarContainer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <PerformanceMonitor />

      <main className="flex-1 pt-[76px]">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Global Snackbar Layer */}
      <SnackbarContainer />
    </div>
  );
};

export default MainLayout;
