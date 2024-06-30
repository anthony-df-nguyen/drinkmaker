import React from "react";
import { DrinkIngredientDetail } from "../models";
import { getStepForUnit } from "../utils";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";

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
          options={[
            { value: "oz", label: "oz" },
            { value: "ml", label: "ml" },
            { value: "dash", label: "dash" },
            { value: "tsp", label: "tsp" },
            { value: "tbsp", label: "tbsp" },
            { value: "cup", label: "cup" },
            { value: "part", label: "part" },
            { value: "slice", label: "slice" },
            { value: "wedge", label: "wedge" },
            { value: "piece", label: "piece" },
            { value: "pinch", label: "pinch" },
            { value: "drop", label: "drop" },
            { value: "splash", label: "splash" },
            { value: "shot", label: "shot" },
            { value: "glass", label: "glass" },
          ]}
        />
      </div>
    </div>
  );
};

export default IngredientDetail;