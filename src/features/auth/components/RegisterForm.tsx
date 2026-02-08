import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/common/Icon";
import { useRegisterForm } from "../hooks/useRegisterForm";

interface Props {
  onSubmit: (payload: { fullName: string; email: string }) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSubmit, onSwitchToLogin }: Props) => {
  const {
    formData,
    errors,
    acceptTerms,
    isLoading,
    strengthLabel,
    passwordStrength,
    setAcceptTerms,
    handleInputChange,
    submitForm,
  } = useRegisterForm({ onSubmit });

  const getStrengthColor = () => {
    if (passwordStrength < 6) return "bg-error";
    if (passwordStrength < 10) return "bg-warning";
    return "bg-success";
  };

  const getStrengthWidth = () => {
    if (passwordStrength < 6) return "w-1/3";
    if (passwordStrength < 10) return "w-2/3";
    return "w-full";
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      className="space-y-5"
    >
      <Input
        name="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => handleInputChange("fullName", e.target.value)}
        error={errors.fullName}
        required
      />

      <Input
        name="email"
        label="Email Address"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
        error={errors.email}
        required
      />

      <Input
        type="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
        error={errors.password}
        required
      />

      {formData.password && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Password strength</span>
            <span>{strengthLabel}</span>
          </div>

          <div className="h-1.5 bg-muted rounded-full">
            <div
              className={`h-full ${getStrengthColor()} ${getStrengthWidth()}`}
            />
          </div>
        </div>
      )}

      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
        required
      />

      {/* Terms */}
      <label className="flex gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
        <span>I agree to Terms & Privacy Policy</span>
      </label>

      {errors.terms && <p className="text-sm text-error">{errors.terms}</p>}

      {errors.submit && (
        <div className="flex gap-2 p-3 bg-error/10 rounded-md">
          <Icon name="AlertCircle" size={18} />
          <p>{errors.submit}</p>
        </div>
      )}

      <Button type="submit" fullWidth loading={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary"
        >
          Already have an account?
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
