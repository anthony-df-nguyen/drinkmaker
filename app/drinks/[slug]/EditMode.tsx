"use client";
import { useState, useEffect, useCallback } from "react";
import Editor from "./instructions/editor/Editor";
import TextInput from "@/components/Inputs/TextInput";
import TextArea from "@/components/Inputs/TextArea";
import Select from "@/components/Inputs/Select";
import Button from "@/components/UI/Button";
import { DrinkSchema } from "../models";
import { updateDrink } from "../actions";
import { InstructionFormat } from "./instructions/models";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { enqueueSnackbar } from "notistack";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
}

const EditMode: React.FC<ViewOnlyModeProps> = ({ drink }) => {
  const [form, setForm] = useState({ ...drink });
  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "name") {
      setForm({ ...form, name: value, unique_name: sanitizeInput(value) });
    } else {
      setForm({ ...form, [field]: value });
    }
  };
  const submitForm = async () => {
    try {
      await updateDrink(drink.id, form).then(() => {
        enqueueSnackbar("Successfully updated drink", { variant: "success" });
      });
    } catch (error) {
      console.error("Error updating drink: ", error);
      enqueueSnackbar("Error updating drink", { variant: "error" });
    }
  };

  return (
    <form className="mt-8">
      <TextInput
        id="drinkName"
        label="Name"
        value={drink.name}
        onChange={(value: string) => handleChange("name", value || "")}
        delay={500}
        minLength={3}
        maxLength={50}
        type="text"
        required
      />
      <TextArea
        id="drinkDescription"
        label="Description"
        value={drink.description}
        onChange={(value: string) => handleChange("description", value || "")}
        delay={500}
        minLength={3}
        maxLength={250}
      />
      <Select
        label="Drink Type"
        required
        options={[
          { value: "cocktail", label: "Cocktail" },
          { value: "coffee", label: "Coffee" },
          { value: "juice", label: "Juice" },
          { value: "mocktail", label: "Mocktail" },
          { value: "shake", label: "Shake" },
          { value: "smoothie", label: "Smoothie" },
          { value: "tea", label: "Tea" },
          { value: "other", label: "Other" },
        ]}
        defaultValue={drink.drink_type}
        onChange={(value: string) => handleChange("drink_type", value)}
      />
      {/* Editor */}
      <div className="mt-4">
        <Editor
          initialContent={drink.instructions}
          onChangeHandler={handleChange}
        />
      </div>

      <Button label="Submit" disabled={false} onClick={submitForm} />
    </form>
  );
};

export default EditMode;
