import { useSnackbarStore } from "@/domain/ui/store/snackbar.store";
import { useEffect, useMemo, useRef, useState } from "react";

interface RegisterPayload {
  fullName: string;
  email: string;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  submit?: string;
}

interface UseRegisterFormProps {
  onSubmit: (payload: RegisterPayload) => void;
}

export const useRegisterForm = ({ onSubmit }: UseRegisterFormProps) => {
  /* ---------------- Local State & Refs ---------------- */
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  /* ---------------- Zustland Store ---------------- */
  const showSnackbar = useSnackbarStore((s) => s.show);

  /* ---------------- Password Strength ---------------- */

  const passwordStrength = useMemo(() => {
    return formData.password.length;
  }, [formData.password]);

  const strengthLabel = useMemo(() => {
    if (passwordStrength < 6) return "Weak";
    if (passwordStrength < 10) return "Medium";
    return "Strong";
  }, [passwordStrength]);

  /* ---------------- Side Effects ---------------- */

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLInputElement | null;

      if (target?.type === "password") {
        e.preventDefault();
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    validationIntervalRef.current = setInterval(() => {
      console.log("Form validation check running...");
    }, 3000);

    return () => {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
      }
    };
  }, []);

  /* ---------------- Handlers ---------------- */

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    return newErrors;
  };

  const submitForm = () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    setTimeout(() => {
      if (formData.email === "demo@reactarchitect.com") {
        setErrors({
          submit: "Registration failed. Account already exists",
        });
        showSnackbar({
          variant: "error",
          message: "Registration failed. Please use a different email.",
        });
        setIsLoading(false);
        return;
      }

      onSubmit({
        fullName: formData.fullName,
        email: formData.email,
      });
    }, 2000);
  };

  return {
    formData,
    errors,
    acceptTerms,
    isLoading,
    strengthLabel,
    passwordStrength,

    setAcceptTerms,
    handleInputChange,
    submitForm,
  };
};
