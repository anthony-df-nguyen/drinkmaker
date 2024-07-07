import React, { useState } from "react";
import { TagOption } from "@/components/MUIInputs/Tags";
import { useGlobalDrinkForm } from "../context";
import { InsertDrinkIngredients, DrinkIngredientViewData } from "./models";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { formatText } from "@/utils/formatText";
import CardTable, { Column } from "@/components/UI/CardTable";
import Button from "@/components/UI/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useListIngredients } from "@/app/ingredients/context/ListIngredientsContext";

const ReadView: React.FC = ({}) => {
  const { globalDrinkForm } = useGlobalDrinkForm();
  const { allIngredients } = useListIngredients();

  const findIngredientLabelByValue = (value: string): string => {
    const ingredient = allIngredients.find((option) => option.id === value);
    return formatText(ingredient?.name ?? "") ?? "";
  };
  const [multiplier, setMultiplier] = useState<number>(1);

  const columns: Column<DrinkIngredientViewData>[] = [
    { header: "Ingredient", accessor: "name" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Unit", accessor: "unit" },
  ];

  const data =
    globalDrinkForm?.ingredients?.map((ing) => ({
      name: findIngredientLabelByValue(ing.ingredient_id),
      quantity: ing.quantity * multiplier,
      unit: ing.unit,
    })) ?? [];

  const changeMultiplier = (direction: string) => {
    direction === "up" && setMultiplier(multiplier + 1);
    direction === "down" && setMultiplier(multiplier - 1);
  };

  return (
    <div className="w-full">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="text-xl">Ingredients</div>

        {/* Multipliers */}
        {data.length > 0 && (
          <div className="">
            <span className="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                disabled={multiplier === 1}
                onClick={() => changeMultiplier("down")}
                className="relative inline-flex items-center rounded-l-md bg-white dark:bg-black px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-stone-800 dark:ring-1 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">Previous</span>-
              </button>
              <div className="relative -ml-px inline-flex items-center text-sm  bg-white dark:bg-black px-2 py-2 text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-stone-800 dark:ring-1 hover:bg-gray-50 focus:z-10">
                {multiplier} Servings
              </div>
              <button
                type="button"
                onClick={() => changeMultiplier("up")}
                className="relative -ml-px inline-flex items-center rounded-r-md bg-white dark:bg-black px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-stone-800 dark:ring-1 hover:bg-gray-50 focus:z-10"
              >
                <span className="sr-only">Next</span>+
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="mt-4">
        <CardTable<DrinkIngredientViewData> columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ReadView;
