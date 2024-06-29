
import React, { useEffect, useState } from "react";
import { useListIngredients } from "./context/ListIngredientsContext";
import { formatText } from "@/utils/formatText";
import Card from "@/components/UI/Card";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import EditForm from "./forms/EditForm";
import DeleteForm from "./forms/DeleteForm";
import Pagination from "@/components/UI/Pagination";
import { queryAllIngredients } from "./actions";
import { useModal } from "@/context/ModalContext";

/**
 * Renders a list of ingredients.
 *
 * @component
 * @returns {JSX.Element} The rendered IngredientList component.
 */
const IngredientList: React.FC = () => {
  const { showModal } = useModal();
  const { ingredients, setIngredients, count } = useListIngredients();
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    try {
      queryAllIngredients(currentPage, 10).then((data) => setIngredients(data));
    } catch (error) {
      console.error("Error querying ingredients: ", error);
    }
  }, [currentPage, setIngredients]);

  return (
    <div className="mt-4">
      <div className="mt-8 grid gap-2">
        {ingredients.map((ingredient) => (
          <Card key={ingredient.name}>
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="text-base">{formatText(ingredient.name)}</div>
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
      <Pagination
        totalItems={count}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default IngredientList;
