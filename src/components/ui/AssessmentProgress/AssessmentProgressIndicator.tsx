import { useLocation } from "react-router-dom";
import { useAssessmentProgress } from "./assessmentProgress.context";
import type { AssessmentRoutePath } from "./types";

/* ---------- Route Normalizer ---------- */
const normalizePath = (path: string): AssessmentRoutePath => {
  if (path.startsWith("/products/") && path !== "/products") {
    return "/products/:productId";
  }

  return path as AssessmentRoutePath;
};

const navigationItems: { path: AssessmentRoutePath; label: string }[] = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/products/:productId", label: "Product Details" },
  { path: "/shopping-cart", label: "Cart" },
  { path: "/user-authentication", label: "Account" },
];

const AssessmentProgressIndicator = () => {
  const location = useLocation();
  const { getProgressPercentage } = useAssessmentProgress();

  const currentPath = normalizePath(location.pathname);

  return (
    <div className="hidden md:flex items-center gap-1 px-4">
      {navigationItems.map((item) => {
        const percentage = getProgressPercentage(item.path);

        /* ✅ Custom Active Handling */
        const isActive =
          item.path === "/products/:productId"
            ? location.pathname.startsWith("/products")
            : currentPath === item.path;

        return (
          <div key={item.path} className="relative group">
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                percentage === 100
                  ? "bg-success"
                  : percentage > 0
                  ? "bg-warning"
                  : "bg-muted"
              } ${isActive ? "scale-125 ring-2 ring-primary/40" : ""}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AssessmentProgressIndicator;
