import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/* ---------------- Types ---------------- */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

/* ---------------- Base Classes ---------------- */

const baseInputClasses =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

/* ---------------- Component ---------------- */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      description,
      error,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    /* ---------- Checkbox / Radio ---------- */

    if (type === "checkbox" || type === "radio") {
      return (
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          className={cn(
            "h-4 w-4 border border-input bg-background text-primary focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            type === "radio" && "rounded-full",
            type === "checkbox" && "rounded",
            className
          )}
          {...props}
        />
      );
    }

    /* ---------- Standard Input ---------- */

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none",
              error ? "text-destructive" : "text-foreground"
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : description ? descriptionId : undefined
          }
          className={cn(
            baseInputClasses,
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />

        {description && !error && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
