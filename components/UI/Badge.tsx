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
        "inline-flex items-center rounded-md px-2 py-1 text-xs  text-gray-600 ring-1 ring-inset ring-gray-500/10",
        color
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
