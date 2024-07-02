import React, { useCallback, useState } from "react";
import { upsertDrinkIngredients } from "../actions";
import Tags, { TagOption } from "@/components/MUIInputs/Tags";
import Button from "@/components/UI/Button";
import { enqueueSnackbar } from "notistack";
import { DrinkIngredientDetail, InsertDrinkIngredients } from "../models";
import CardTable, { Column } from "@/components/UI/CardTable";
import NumberInput from "@/components/MUIInputs/NumberInput";
import CustomSelect from "@/components/MUIInputs/Select";
import { measuringUnits } from "../utils";

interface IngredientFormProps {
  currentForm: InsertDrinkIngredients;
  ingredientOptions: TagOption[];
  activeSelection: TagOption[];
  handleSelectedIngredient: (value: TagOption[]) => void;
  handleChangeUnits: (value: DrinkIngredientDetail) => void;
  handleCancel: () => void;
}

/**
 * Component for rendering the Ingredient Form.
 *
 * @component
 * @param {IngredientFormProps} props - The component props.
 * @param {string} props.currentForm - The current form.
 * @param {Array} props.ingredientOptions - The options for ingredients.
 * @param {Array} props.activeSelection - The active selection.
 * @param {Function} props.handleSelectedIngredient - The function to handle selected ingredient.
 * @param {Function} props.handleChangeUnits - The function to handle unit changes.
 * @param {Function} props.handleCancel - The function to handle form cancellation.
 * @returns {JSX.Element} The rendered Ingredient Form component.
 */
const IngredientForm: React.FC<IngredientFormProps> = ({
  currentForm,
  ingredientOptions,
  activeSelection,
  handleSelectedIngredient,
  handleChangeUnits,
  handleCancel,
}) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  console.log(errors)

  const handleFieldError = (field: string, hasError: boolean) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: hasError }));
  };

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (Object.values(errors).some((error) => error)) {
        enqueueSnackbar("Please fix the errors before submitting", {
          variant: "error",
        });
        return;
      }
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
    [currentForm, handleCancel, errors]
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
      render: (row, index) => (
        <NumberInput
          label="Quantity"
          value={row.quantity}
          onChange={(value: number) =>
            handleChangeUnits({ ...row, quantity: value })
          }
          required
          helperText="Enter a number"
          variant="outlined"
          min={0}
          handleError={(hasError) => handleFieldError(`quantity_${index}`, hasError)}
        />
      ),
    },
    {
      header: "Unit",
      accessor: "unit",
      render: (row, index) => (
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
        {Object.values(errors).some((error) => error) ? "Error" : null}
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
              disabled={Object.values(errors).some((error) => error)}
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