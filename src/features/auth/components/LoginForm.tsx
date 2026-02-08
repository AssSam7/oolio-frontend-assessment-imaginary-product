import { useCallback, useEffect, useRef, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/common/Icon";
import { useSnackbarStore } from "@/domain/ui/store/snackbar.store";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface LoginPayload {
  email: string;
  rememberMe: boolean;
}

interface Props {
  onSubmit: (payload: LoginPayload) => void;
  onSwitchToRegister: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const validateLoginForm = (email: string, password: string): FormErrors => {
  const errors: FormErrors = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

/* -------------------------------------------------------------------------- */
/* Login Form                                                                 */
/* -------------------------------------------------------------------------- */

const LoginForm = ({ onSubmit, onSwitchToRegister }: Props) => {
  /* ---------------- Local State & Refs ---------------- */
  const [email, setEmail] = useState("demo@reactarchitect.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---------------- Zustland Store ---------------- */
  const showSnackbar = useSnackbarStore((s) => s.show);

  /* ---------------- Submit Handler ---------------- */

  const submitForm = useCallback(() => {
    const validationErrors = validateLoginForm(email, password);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      if (email === "demo@reactarchitect.com" && password === "React2026!") {
        onSubmit({ email, rememberMe });
      } else {
        setErrors({
          submit: "Authentication failed. Invalid credentials provided.",
        });
        showSnackbar({
          variant: "error",
          message: "Login failed. Please check your credentials.",
        });
      }

      setIsLoading(false);
    }, 1500);
  }, [email, password, rememberMe, onSubmit, showSnackbar]);

  /* ---------------- Form Submit ---------------- */

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitForm();
  };

  /* ---------------- Enter Key Handler ---------------- */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && email && password) {
        submitForm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [email, password, rememberMe, submitForm]);

  /* ---------------- Auto Clear Errors ---------------- */

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;

    errorTimeoutRef.current = setTimeout(() => {
      setErrors({});
    }, 5000);

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [errors]);

  /* ---------------- Render ---------------- */

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 md:space-y-5 lg:space-y-6"
    >
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />

      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />

      {/* Remember Me */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-input text-primary"
          />
          <span className="text-sm text-foreground">Remember me</span>
        </label>

        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="flex gap-2 p-3 bg-error/10 border border-error/20 rounded-md">
          <Icon name="AlertCircle" size={18} />
          <p className="text-sm text-error">{errors.submit}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center pt-3">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary font-medium"
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
