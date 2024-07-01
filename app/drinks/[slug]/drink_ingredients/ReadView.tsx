import React, { useState } from "react";
import Card from "@/components/UI/Card";
import { TagOption } from "@/components/MUIInputs/Tags";
import { InsertDrinkIngredients, DrinkIngredientViewData } from "./models";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import CardTable, { Column } from "@/components/UI/CardTable";
import Button from "@/components/UI/Button";
import classNames from "@/utils/classNames";

interface ReadViewProps {
  activeSelection: TagOption[];
  setEditMode: (editMode: boolean) => void;
  hover: boolean;
  details: InsertDrinkIngredients;
}

const ReadView: React.FC<ReadViewProps> = ({
  activeSelection,
  setEditMode,
  hover,
  details,
}) => {
  const findIngredientLabelByValue = (value: string): string | undefined => {
    const ingredient = activeSelection.find((option) => option.value === value);
    return ingredient?.label;
  };

  const [multiplifier, setMultiplifier] = useState<number>(1);

  const columns: Column<DrinkIngredientViewData>[] = [
    { header: "Ingredient", accessor: "name" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Unit", accessor: "unit" },
  ];

  const data = details.ingredient_details.map((ing) => ({
    name: findIngredientLabelByValue(ing.ingredient_id)!,
    quantity: ing.quantity * multiplifier,
    unit: ing.unit,
  }));

  const changeMultiplier = (direction: string) => {
    direction === "up" && setMultiplifier(multiplifier + 1);
    direction === "down" && setMultiplifier(multiplifier - 1);
  };

  return (
    <div className="w-full">
      {/* Top Row */}
      <div className="flex justify-between">
        <div className="grid items-center gap-2">
          <div className="pageTitle mb-2">Ingredients</div>
        </div>
        {hover && (
          <div
            className="w-8 h-8 cursor-pointer"
            onClick={() => setEditMode(true)}
          >
            <PencilSquareIcon color="gray"/>
          </div>
        )}
      </div>
      {/* Multipliers */}
      <div className="flex flex-row items-center gap-4 justify-between">
        <div className="font-bold"># of Servings: {multiplifier}</div>
        <div className="flex gap-2">
          <div className={classNames(multiplifier === 1 ? "hidden" : "")}>
            <Button
              label="Less"
              type="button"
              variant="cancel"
              onClick={() => changeMultiplier("down")}
            />
          </div>
          <div>
            <Button
              label="More"
              type="button"
              variant="primary"
              onClick={() => changeMultiplier("up")}
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="mt-4">
        <CardTable<DrinkIngredientViewData> columns={columns} data={data} />
      </div>
    </div>
  );
};

export default ReadView;
