// components/IngredientList.tsx

import React from "react";
import { Ingredients } from "@/schema/ingredients";
import { formatText } from "@/utils/formatText";
import CardList from "@/components/UI/CardList";

interface IngredientListProps {
  ingredients: Ingredients[];
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 justify-center">
        <div className="text-lg text-center mt-4">
          {ingredients.length} Ingredients Found
        </div>
      </div>
      <div className="mt-8">
        <CardList
          items={ingredients.map((row, i) => {
            return {
              id: i,
              content: formatText(row.name),
            };
          })}
        />
      </div>
    </div>
  );
};

export default IngredientList;
