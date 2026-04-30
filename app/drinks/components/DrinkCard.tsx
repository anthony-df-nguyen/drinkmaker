import React from "react";
import Link from "next/link";
import Thumbnail from "@/components/UI/Thumbnail";
import { DrinkSchema } from "../models";

interface DrinkCardProps {
  drink: DrinkSchema;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  return (
    <Link href={`/drinks/${drink.unique_name}`}>
      <div className="p-4 bg-background flex flex-row gap-4 items-center hover:bg-surface-raised transition-colors">
        <Thumbnail name={drink.name} picture={drink.picture} />
        <div className="flex-1 min-w-0">
          <div className="font-serif text-base text-foreground truncate">
            {drink.name}
          </div>
          {drink.description && (
            <div className="mt-1 text-xs font-light text-muted line-clamp-2">
              {drink.description}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default DrinkCard;
