import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  color: string;
}

const Badge: React.FC<BadgeProps> = ({ label, color, ...props }) => {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-[9px] text-muted ring-1 ring-inset ring-gray-500/10",
        color,
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
