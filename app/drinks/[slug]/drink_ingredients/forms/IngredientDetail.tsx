
/**
 * Renders a form for editing the details of a drink ingredient.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.id - The ID of the ingredient.
 * @param {string} props.label - The label of the ingredient.
 * @param {number} props.quantity - The quantity of the ingredient.
 * @param {string} props.unit - The unit of measurement for the ingredient.
 * @param {(value: DrinkIngredientDetail) => void} props.onChange - The callback function to be called when the ingredient details are changed.
 */
import React from "react";
import { DrinkIngredientDetail } from "../models";
import { getStepForUnit } from "../utils";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";
import { measuringUnits } from "../utils";

interface IngredientDetailProps {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  onChange: (value: DrinkIngredientDetail) => void;
}

const IngredientDetail: React.FC<IngredientDetailProps> = ({
  id,
  label,
  quantity,
  unit,
  onChange,
}) => {
  const handleChange = (field: keyof DrinkIngredientDetail, value: string | number) => {
    const newData: DrinkIngredientDetail = {
      ingredient_id: id,
      quantity: field === "quantity" ? (value as number) : quantity,
      unit: field === "unit" ? (value as string) : unit,
    };
    onChange(newData);
  };

  return (
    <div className="p-4 border rounded gap-4 flex flex-col md:flex-row md:items-center">
      <div className="md:flex-1 font-medium">{label}</div>
      <div className="md:flex-2">
        <DebouncedTextInput
          label="Quantity"
          value={quantity}
          onChange={(value: number) => handleChange("quantity", value)}
          type="number"
          required
          helperText="Enter a number"
          inputProps={{
            min: 0,
            step: getStepForUnit(unit), // Ensure step is based on the updated form state
          }}
        />
      </div>
      <div className="md:flex-0">
        <CustomSelect
          label="Unit"
          value={unit}
          onChange={(value: string) => handleChange("unit", value)}
          options={measuringUnits}
        />
      </div>
    </div>
  );
};

export default IngredientDetail;