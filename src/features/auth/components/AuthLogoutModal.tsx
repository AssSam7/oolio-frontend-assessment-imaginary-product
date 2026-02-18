import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "@/components/common/Icon";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */
interface Props {
  onClose: () => void;
}

/* -------------------------------------------------------------------------- */
/* Auth Success Modal                                                         */
/* -------------------------------------------------------------------------- */

const AuthLogoutModal = ({ onClose }: Props) => {
  const navigate = useNavigate();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------- Auto Redirect ---------------- */

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      onClose();
      navigate("/dashboard");
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigate, onClose]);

  /* ---------------- Render ---------------- */

  return (
    <div className="fixed inset-0 bg-card glass backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          {/* Success Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-success/20 rounded-full flex items-center justify-center">
            <Icon name="CheckCircle2" size={40} color="var(--color-success)" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Logout Success
            </h2>
          </div>

          {/* Footer */}
          <div className="w-full space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Redirecting to dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogoutModal;
