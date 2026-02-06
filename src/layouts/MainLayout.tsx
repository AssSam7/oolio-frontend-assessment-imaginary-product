import { Outlet } from "react-router-dom";
import AppHeader from "@/components/ui/AppHeader";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 pt-[60px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
