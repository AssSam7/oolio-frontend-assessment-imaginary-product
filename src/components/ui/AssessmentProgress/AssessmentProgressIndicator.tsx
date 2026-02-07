import { useLocation } from "react-router-dom";
import { useAssessmentProgress } from "./assessmentProgress.context";
import type { AssessmentRoutePath } from "./types";

const navigationItems: { path: AssessmentRoutePath; label: string }[] = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/products", label: "Products" },
  { path: "/shopping-cart", label: "Cart" },
  { path: "/user-authentication", label: "Account" },
];

const AssessmentProgressIndicator = () => {
  const location = useLocation();
  const { getProgressPercentage } = useAssessmentProgress();

  return (
    <div className="hidden md:flex items-center gap-1 px-4">
      {navigationItems.map((item) => {
        // const itemProgress = progress[item.path];
        const percentage = getProgressPercentage(item.path);
        const isActive = location.pathname === item.path;

        return (
          <div key={item.path} className="relative group">
            <div
              className={`w-2 h-2 rounded-full ${
                percentage === 100
                  ? "bg-success"
                  : percentage > 0
                  ? "bg-warning"
                  : "bg-muted"
              } ${isActive ? "scale-125" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AssessmentProgressIndicator;
