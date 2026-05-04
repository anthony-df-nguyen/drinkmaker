"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { contrastColor } from "@/utils/contrastColor";

interface BadgeProps {
  label: string;
  /** CSS color value (hex, rgb, named) used as the badge background. */
  color: string;
}

const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  console.log(color);
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-[9px] ring-1 ring-inset ring-gray-500/10",
      )}
      style={{ backgroundColor: color }}
    >
      <span className="text-black/70">{label}</span>
    </span>
  );
};

export default Badge;
