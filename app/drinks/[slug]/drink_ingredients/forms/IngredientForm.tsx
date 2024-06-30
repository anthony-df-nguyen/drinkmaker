

/**
 * Represents a form for managing drink ingredients.
 *
 * @component
 * @example
 * ```tsx
 * <IngredientForm
 *   currentForm={currentForm}
 *   ingredientOptions={ingredientOptions}
 *   activeSelection={activeSelection}
 *   handleSelectedIngredient={handleSelectedIngredient}
 *   handleChangeUnits={handleChangeUnits}
 *   handleCancel={handleCancel}
 * />
 * ```
 */
import React, { useCallback } from "react";
import { upsertDrinkIngredients } from "../actions";
import Tags, { TagOption } from "@/components/MUIInputs/Tags";
import Button from "@/components/UI/Button";
import IngredientDetail from "./IngredientDetail";
import { enqueueSnackbar } from "notistack";
import { DrinkIngredientDetail, InsertDrinkIngredients } from "../models";
import Card from "@/components/UI/Card";

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
          handleCancel;
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

  return (
    <Card className="w-full">
      <div className="w-full">
        <div className="grid items-center gap-2">
          <div className="pageTitle mb-2">Ingredients</div>
          <div>Step 1: Search and add ingredients</div>
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
            <div className="mt-8">Step 2: Manage Ingredient Details</div>
            <div className="font-light">
              Enter ingredient quantities for 1 serving of the drink
            </div>
            <div className="mt-8 flex flex-col gap-4">
              {currentForm.ingredient_details.map((row) => (
                <IngredientDetail
                  key={row.ingredient_id}
                  label={
                    activeSelection.find(
                      (opt) => opt.value === row.ingredient_id
                    )?.label || ""
                  }
                  id={row.ingredient_id}
                  quantity={row.quantity}
                  unit={row.unit}
                  onChange={handleChangeUnits}
                />
              ))}
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
    </Card>
  );
};

export default IngredientForm;
