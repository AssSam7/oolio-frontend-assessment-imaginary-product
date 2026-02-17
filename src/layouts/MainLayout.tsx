import { Outlet } from "react-router-dom";
import AppHeader from "@/components/ui/AppHeader";
import { Suspense, useEffect } from "react";
import PageLoader from "@/components/common/PageLoader";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";
import SnackbarContainer from "@/components/ui/SnackbarContainer";
import { supabase } from "@/lib/supabase";

const MainLayout = () => {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Session:", data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth changed:", session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-app-gradient" />

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
