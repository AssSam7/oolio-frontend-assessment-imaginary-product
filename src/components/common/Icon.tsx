import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";

type IconName = keyof typeof LucideIcons;

interface IconProps extends LucideProps {
  name: IconName;
}

const Icon = ({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}: IconProps) => {
  const IconComponent = LucideIcons[name] as ComponentType<LucideProps>;

  if (!IconComponent) {
    return (
      <HelpCircle
        size={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
};

export default Icon;
