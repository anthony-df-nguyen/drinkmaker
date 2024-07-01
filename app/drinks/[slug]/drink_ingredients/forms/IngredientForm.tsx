import React, { useCallback } from "react";
import { upsertDrinkIngredients } from "../actions";
import Tags, { TagOption } from "@/components/MUIInputs/Tags";
import Button from "@/components/UI/Button";
import { enqueueSnackbar } from "notistack";
import { DrinkIngredientDetail, InsertDrinkIngredients } from "../models";
import Card from "@/components/UI/Card";
import CardTable, { Column } from "@/components/UI/CardTable";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";
import { getStepForUnit, measuringUnits } from "../utils";

interface IngredientFormProps {
  currentForm: InsertDrinkIngredients;
  ingredientOptions: TagOption[];
  activeSelection: TagOption[];
  handleSelectedIngredient: (value: TagOption[]) => void;
  handleChangeUnits: (value: DrinkIngredientDetail) => void;
  handleCancel: () => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  currentForm,
  ingredientOptions,
  activeSelection,
  handleSelectedIngredient,
  handleChangeUnits,
  handleCancel,
}) => {
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        upsertDrinkIngredients(currentForm).then(() => {
          handleCancel();
          enqueueSnackbar("Drink ingredients updated", { variant: "success" });
        });
      } catch (error) {
        enqueueSnackbar("Error updating drink ingredients", {
          variant: "error",
        });
      }
    },
    [currentForm, handleCancel]
  );

  const columns: Column<DrinkIngredientDetail>[] = [
    {
      header: "Ingredient",
      accessor: "ingredient_id",
      render: (row) => (
        <span>
          {activeSelection.find((opt) => opt.value === row.ingredient_id)
            ?.label || ""}
        </span>
      ),
    },
    {
      header: "Quantity",
      accessor: "quantity",
      render: (row) => (
        <DebouncedTextInput
          label="Quantity"
          value={row.quantity}
          onChange={(value: number) =>
            handleChangeUnits({ ...row, quantity: value })
          }
          type="number"
          required
          helperText="Enter a number"
          variant="outlined"
          inputProps={{
            min: 0,
            step: getStepForUnit(row.unit),
          }}
        />
      ),
    },
    {
      header: "Unit",
      accessor: "unit",
      render: (row) => (
        <CustomSelect
          label="Unit"
          value={row.unit}
          onChange={(value: string) =>
            handleChangeUnits({ ...row, unit: value })
          }
          options={measuringUnits}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="grid items-center gap-2">
        <div className="pageTitle mb-2">Ingredients</div>
        <div className="font-bold">Step 1: Add or remove ingredients</div>
        <form onSubmit={onSubmit}>
          <div className="w-full">
            <Tags
              label="Ingredients"
              options={ingredientOptions}
              defaultValue={activeSelection}
              placeholder="Select ingredients"
              onChange={handleSelectedIngredient}
            />
          </div>
          <div className="mt-8 font-bold">Step 2: Manage Ingredient Details</div>
          <div className="font-light">
            Enter ingredient quantities for 1 serving of the drink
          </div>
          <div className="mt-8 ">
            <CardTable<DrinkIngredientDetail>
              columns={columns}
              data={currentForm.ingredient_details}
              breakpoint="768px"
              hideColumnsOnMobile
            />
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              label="Cancel"
              disabled={false}
              onClick={handleCancel}
              type="button"
              variant="cancel"
            />
            <Button
              label="Submit"
              disabled={false}
              type="submit"
              variant="primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientForm;
