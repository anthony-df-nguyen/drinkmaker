import React from "react";
import classNames from "@/utils/classNames";

interface BadgeProps {
  label: string;
  color: string;
}

const Badge: React.FC<BadgeProps> = ({ label, color, ...props }) => {
  return (
    <span
      className={classNames(
        "rounded-full px-2 py-1 text-[9px] text-muted ring-1 ring-inset ring-gray-500/10",
        color,
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
