import { forwardRef, useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import Icon, { type IconName } from "@/components/common/Icon";

/* ------------------ Variants ------------------ */

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        danger: "bg-error text-error-foreground hover:bg-error/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
        xs: "h-8 px-2 text-xs",
        xl: "h-12 px-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/* ------------------ Types ------------------ */

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  iconName?: IconName;
  iconPosition?: "left" | "right";
  iconSize?: number;
  fullWidth?: boolean;
}

/* ------------------ Constants ------------------ */

const ICON_SIZE_MAP = {
  xs: 12,
  sm: 14,
  default: 16,
  lg: 18,
  xl: 20,
  icon: 16,
};

/* ------------------ Component ------------------ */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "default",
      asChild,
      loading,
      iconName,
      iconPosition = "left",
      iconSize,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const computedIconSize = useMemo(
      () => iconSize ?? ICON_SIZE_MAP[size ?? "default"] ?? 16,
      [iconSize, size]
    );

    const renderIcon = () =>
      iconName ? (
        <Icon
          name={iconName}
          size={computedIconSize}
          className={cn(
            children && iconPosition === "left" && "mr-2",
            children && iconPosition === "right" && "ml-2"
          )}
        />
      ) : null;

    const content = (
      <>
        {loading && (
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {iconPosition === "left" && renderIcon()}
        {children}
        {iconPosition === "right" && renderIcon()}
      </>
    );

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export default Button;
