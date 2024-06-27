// components/IngredientList.tsx

import React from "react";
import { IngredientsSchema } from "./models";
import { formatText } from "@/utils/formatText";
import Card from "@/components/UI/Card";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import EditForm from "./forms/EditForm";
import DeleteForm from "./forms/DeleteForm";
import { useModal } from "@/context/ModalContext";

interface IngredientListProps {
  ingredients: IngredientsSchema[];
}

/**
 * Renders a list of ingredients.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.ingredients - The array of ingredients to display.
 * @returns {JSX.Element} The rendered IngredientList component.
 */
const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
  const { showModal } = useModal();
  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 justify-center">
        <div className="text-lg text-center mt-4">
          {ingredients.length} Ingredients Found
        </div>
      </div>
      <div className="mt-8 grid gap-2">
        {ingredients.map((ingredient) => (
          <Card key={ingredient.name}>
            <div className="flex items-center gap-2">
              <div className="text-md">{formatText(ingredient.name)}</div>
              <div className="flex-1"></div>
              <div
                className="text-gray-500 w-5 h-5 cursor-pointer"
                onClick={() => showModal(<EditForm ingredient={ingredient} />)}
              >
                <PencilSquareIcon />
              </div>
              <div
                className="text-gray-500 w-5 h-5 cursor-pointer"
                onClick={() =>
                  showModal(<DeleteForm ingredient={ingredient} />)
                }
              >
                <TrashIcon />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IngredientList;
