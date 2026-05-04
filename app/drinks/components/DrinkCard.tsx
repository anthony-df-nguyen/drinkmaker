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
        <Thumbnail name={drink.name} picture={drink.picture} className="h-20 w-20 lg:h-24 lg:w-24"/>
        <div className="min-w-0 ">
          <div className="flex flex-col gap-0">
            <div className="font-serif text-base text-foreground truncate">
              {drink.name}
            </div>

            <div className="text-xs font-light text-muted line-clamp-2">
              Creator: {drink.profiles.username}
            </div>
            {drink.description && (
              <div className="mt-2 text-sm font-light text-muted line-clamp-2">
                {drink.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DrinkCard;
