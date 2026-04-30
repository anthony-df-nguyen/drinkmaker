import React from "react";
import { cn } from "@/lib/utils";
import { thumbnailColor } from "@/utils/thumbnail";

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
