import React from "react";
import { cn } from "@/lib/utils";



export const thumbnailColor = (name: string) => {
  const THUMBNAIL_COLORS = [
  "bg-gradient-to-br from-amber-400 to-amber-700",
  "bg-gradient-to-br from-blue-400 to-blue-700",
  "bg-gradient-to-br from-emerald-400 to-emerald-700",
  "bg-gradient-to-br from-rose-400 to-rose-600",
  "bg-gradient-to-br from-violet-400 to-violet-700",
  "bg-gradient-to-br from-cyan-400 to-cyan-700",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-teal-400 to-teal-700",
] as const;
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return THUMBNAIL_COLORS[hash % THUMBNAIL_COLORS.length];
};

interface ThumbnailProps {
  name: string;
  picture?: string | null;
  className?: string;
  letterClassName?: string;
}

/**
 * Square thumbnail that shows an image when provided, otherwise renders a
 * deterministic gradient with the first letter of `name`.
 */
const Thumbnail: React.FC<ThumbnailProps> = ({
  name,
  picture,
  className = "w-16 h-16",
  letterClassName = "text-2xl",
}) => {
  if (picture) {
    return (
      <img
        src={picture}
        alt={name}
        className={cn("rounded object-cover flex-shrink-0", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded flex items-center justify-center flex-shrink-0",
        thumbnailColor(name),
        className,
      )}
    >
      <span className={cn("text-white font-semibold select-none", letterClassName)}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default Thumbnail;
