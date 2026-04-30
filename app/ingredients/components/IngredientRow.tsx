import React from "react";
import Thumbnail from "@/components/UI/Thumbnail";
import { formatText } from "@/utils/formatText";
import { IngredientsSchema } from "../models";

interface IngredientRowProps {
  ingredient: IngredientsSchema;
}

const IngredientRow: React.FC<IngredientRowProps> = ({ ingredient }) => {
  const name = formatText(ingredient.name);
  return (
    <div className="p-4 bg-background flex flex-row gap-4 items-center hover:bg-surface-raised transition-colors">
      <Thumbnail
        name={ingredient.name}
        picture={ingredient.image}
        className="w-10 h-10"
        letterClassName="text-base"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground truncate">{name}</div>
      </div>
    </div>
  );
};

export default IngredientRow;
