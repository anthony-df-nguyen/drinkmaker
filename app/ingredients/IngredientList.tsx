// components/IngredientList.tsx

import React from "react";
import { Ingredients } from "@/schema/ingredients";

interface IngredientListProps {
  ingredients: Ingredients[];
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 justify-center">
        <div className="text-lg text-center mt-4">{ingredients.length} Ingredients Found</div>
      </div>
      <div>
        {ingredients.map((row) => (
          <div key={row.name}>{row.name}</div>
        ))}
      </div>
    </div>
  );
};

export default IngredientList;
