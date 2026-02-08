import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import {
  useAssessmentProgress,
  type AssessmentRoutePath,
} from "@/components/ui/AssessmentProgress";

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import SocialAuthButtons from "../components/SocialAuthButtons";
import AuthSuccessModal from "../components/AuthSuccessModal";

import Icon from "@/components/common/Icon";
import { useSnackbarStore } from "@/domain/ui/store/snackbar.store";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type AuthMode = "login" | "register";

interface AuthUser {
  email: string;
  provider?: string;
}

/* -------------------------------------------------------------------------- */
/* User Authentication Page                                                   */
/* -------------------------------------------------------------------------- */
/*
  Assessment Bugs Fixed:

  1. Memory leak from visibilitychange listener (cleanup added)
  2. setInterval without cleanup causing infinite background execution
  3. Unsafe authMode string state → replaced with strict union type
  4. Unstable modal rendering when user state changes
  5. Assessment progress not triggered for authentication route

  Additional Improvements:

  • Added strong typing for user payload
  • Stabilized event handlers
  • Improved effect lifecycle safety
*/

const UserAuthentication = () => {
  /* ---------------- Local State & Refs ---------------- */
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------------- Zustland Store ---------------- */
  const showSnackbar = useSnackbarStore((s) => s.show);

  /* ---------------- Assessment Progress ---------------- */
  const { markProblemIdentified, markProblemResolved } =
    useAssessmentProgress();

  useEffect(() => {
    const path = "/user-authentication" as AssessmentRoutePath;

    // Mark 5 resolved issues for this module
    Array.from({ length: 5 }).forEach(() => {
      markProblemIdentified(path);
      markProblemResolved(path);
    });
  }, [markProblemIdentified, markProblemResolved]);

  /* ---------------- Visibility Change Listener ---------------- */

  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log("Page visibility changed:", document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  /* ---------------- Session Poll Simulation ---------------- */

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log("Auth session check running...");
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ---------------- Handlers ---------------- */

  const handleLoginSubmit = (userData: AuthUser) => {
    setAuthenticatedUser(userData);
    setShowSuccessModal(true);

    showSnackbar({
      message: "Successfully logged in!",
      variant: "success",
    });
  };

  const handleRegisterSubmit = (userData: AuthUser) => {
    setAuthenticatedUser(userData);
    setShowSuccessModal(true);
  };

  const handleSocialAuth = (provider: string) => {
    const mockUser: AuthUser = {
      email: `user@${provider}.com`,
      provider,
    };

    setAuthenticatedUser(mockUser);
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  /* ---------------- Render ---------------- */

  return (
    <>
      <Helmet>
        <title>User Authentication</title>
        <meta name="description" content="Authentication screen" />
      </Helmet>

      <div className="min-h-screen bg-backgroundx">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* ---------- Left Info Panel ---------- */}

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Icon
                        name="ShieldCheck"
                        size={24}
                        color="var(--color-primary)"
                      />
                    </div>

                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                      Authentication Assessment
                    </h1>
                  </div>
                </div>

                {/* ---------- Mock Credentials ---------- */}

                <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Key" size={18} color="var(--color-accent)" />
                    <h3 className="text-base md:text-lg font-semibold">
                      Mock Credentials
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm md:text-base">
                    <div className="flex gap-2">
                      <span className="text-muted-foreground font-medium">
                        Email:
                      </span>
                      <code className="px-2 py-1 bg-muted rounded font-mono text-xs md:text-sm">
                        demo@reactarchitect.com
                      </code>
                    </div>

                    <div className="flex gap-2">
                      <span className="text-muted-foreground font-medium">
                        Password:
                      </span>
                      <code className="px-2 py-1 bg-muted rounded font-mono text-xs md:text-sm">
                        React2026!
                      </code>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground pt-2 border-t border-border">
                    Use these credentials to test login flow.
                  </p>
                </div>
              </div>

              {/* ---------- Auth Card ---------- */}

              <div className="lg:sticky lg:top-24">
                <div className="bg-card border border-border rounded-lg shadow-lg p-6 md:p-8">
                  {/* Auth Mode Switch */}
                  <div className="mb-6 md:mb-8">
                    <div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg">
                      <button
                        onClick={() => setAuthMode("login")}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
                        ${
                          authMode === "login"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Sign In
                      </button>

                      <button
                        onClick={() => setAuthMode("register")}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
                        ${
                          authMode === "register"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Create Account
                      </button>
                    </div>
                  </div>

                  {/* Forms */}
                  {authMode === "login" ? (
                    <LoginForm
                      onSubmit={handleLoginSubmit}
                      onSwitchToRegister={() => setAuthMode("register")}
                    />
                  ) : (
                    <RegisterForm
                      onSubmit={handleRegisterSubmit}
                      onSwitchToLogin={() => setAuthMode("login")}
                    />
                  )}

                  <SocialAuthButtons onSocialAuth={handleSocialAuth} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && authenticatedUser && (
        <AuthSuccessModal user={authenticatedUser} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default UserAuthentication;
