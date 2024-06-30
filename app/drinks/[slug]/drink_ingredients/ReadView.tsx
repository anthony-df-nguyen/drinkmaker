import React from "react";
import Card from "@/components/UI/Card";
import { TagOption } from "@/components/MUIInputs/Tags";
import { InsertDrinkIngredients, DrinkIngredientViewData } from "./models";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import CardTable, {Column} from "@/components/UI/CardTable";

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

  const columns: Column<DrinkIngredientViewData>[] = [
    { header: "Ingredient", accessor: "name" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Unit", accessor: "unit" },
  ];

  const data = details.ingredient_details.map((ing) => ({
    name: findIngredientLabelByValue(ing.ingredient_id)!,
    quantity: ing.quantity,
    unit: ing.unit,
  }));

  return (
    <Card className="w-full">
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
            <PencilSquareIcon />
          </div>
        )}
      </div>
      {/* Table */}
      <div className="mt-4">
        <CardTable<DrinkIngredientViewData> columns={columns} data={data} />
      </div>
    </Card>
  );
};

export default ReadView;