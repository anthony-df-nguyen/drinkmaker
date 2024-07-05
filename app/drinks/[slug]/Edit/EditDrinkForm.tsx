import React, { useState, useCallback } from "react";
import { useGlobalDrinkForm } from "../context";
import { useListIngredients } from "@/app/ingredients/context/ListIngredientsContext";
import { drinkTypes } from "../../models";
import { DrinkIngredientDetail } from "../drink_ingredients/models";
import { TagOption } from "@/components/MUIInputs/Tags";
import { formatText } from "@/utils/formatText";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";
import NumberInput from "@/components/MUIInputs/NumberInput";
import Tags from "@/components/MUIInputs/Tags";
import Button from "@/components/UI/Button";
import Editor from "../instructions/editor/Editor";
import { measuringUnits } from "../drink_ingredients/utils";

type Props = {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditDrinkForm({setEdit}: Props) {
  const { allIngredients } = useListIngredients();
  const { globalDrinkForm, setGlobalDrinkForm, setFormSubmitted } = useGlobalDrinkForm();

  const [liveFormState, setLiveFormState] = useState(globalDrinkForm);
  const findIngredientById = (id: string) =>
    allIngredients.find((ingredient) => ingredient.id === id);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>(() =>
    liveFormState.ingredients.map((row) => ({
      label: formatText(findIngredientById(row.ingredient_id)?.name ?? ""),
      value: row.ingredient_id,
    }))
  );
  const [quillEditorContent, setQuillEditorContent] = useState<string>(liveFormState.instructions ?? "");

  const handleChange = useCallback((key: string, value: any) => {
    setLiveFormState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleChangeUnitOrQuantity = (
    value: string | number,
    index: number,
    key: "unit" | "quantity"
  ) => {
    const updatedIngredients = liveFormState.ingredients.map((ingredient, i) =>
      i === index ? { ...ingredient, [key]: value } : ingredient
    );
    handleChange("ingredients", updatedIngredients);
  };

  const handleTagsChange = (event: TagOption[]) => {
    setSelectedTags(event);

    const updatedIngredients = event.map((tag) => ({
      ingredient_id: tag.value,
      quantity:
        liveFormState.ingredients.find(
          (ingredient) => ingredient.ingredient_id === tag.value
        )?.quantity ?? 0,
      unit:
        liveFormState.ingredients.find(
          (ingredient) => ingredient.ingredient_id === tag.value
        )?.unit ?? "oz",
    }));
    handleChange("ingredients", updatedIngredients);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFormState = { ...liveFormState, instructions: quillEditorContent };
    setLiveFormState(updatedFormState);
    setGlobalDrinkForm(updatedFormState);
    setFormSubmitted(true);
  };


  return (
    <form className="w-full" onSubmit={handleFormSubmit}>
      <div className="grid gap-8">
        <div className="pageTitle">Drink Details</div>
        <DebouncedTextInput
          label="Name"
          value={liveFormState.name}
          onChange={(value) => handleChange("name", value || "")}
          required
          variant="outlined"
          delay={500}
        />
        <DebouncedTextInput
          label="Description"
          value={liveFormState.description}
          onChange={(value) => handleChange("description", value || "")}
          variant="outlined"
          delay={500}
          multiline
          minRows={3}
        />
        <CustomSelect
          label="Drink Type"
          required
          options={drinkTypes.filter((row) => row.value !== "all")}
          value={liveFormState.drink_type}
          onChange={(value) => handleChange("drink_type", value)}
        />
        <h2 className="pageTitle">Ingredients</h2>
        <div className="font-bold">Step 1: Add or remove ingredients</div>
        <Tags
          label="Ingredients"
          options={allIngredients.map((row) => ({
            label: formatText(row.name),
            value: row.id,
          }))}
          defaultValue={selectedTags}
          placeholder="Select ingredients"
          onChange={handleTagsChange}
        />
        <div className="font-bold">Step 2: Manage Ingredient Details</div>
        <div className="">
          {liveFormState.ingredients.map((ingredient, index) => (
            <div key={index}>
              <span>
                {selectedTags.find(
                  (tag) => tag.value === ingredient.ingredient_id
                )?.label || ""}
              </span>
              <div className="my-4 flex items-center gap-2">
                <NumberInput
                  label="Quantity"
                  value={ingredient.quantity}
                  onChange={(value) =>
                    handleChangeUnitOrQuantity(value, index, "quantity")
                  }
                  required
                  helperText="Enter a number"
                  variant="outlined"
                  min={0}
                />
                <CustomSelect
                  label="Unit"
                  value={ingredient.unit}
                  onChange={(value) =>
                    handleChangeUnitOrQuantity(value, index, "unit")
                  }
                  options={measuringUnits}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="pageTitle">Instructions</div>
        <Editor
          initialContent={globalDrinkForm.instructions}
          onChangeHandler={(content) => {
            setQuillEditorContent(content);
          }}
        />
      </div>
      <div className="flex gap-2 justify-end mt-4">
      <Button
          label="Cancel"
          disabled={false}
          type="button"
          variant="cancel"
          onClick={() => setEdit(false)}
        />
        <Button
          label="Submit"
          disabled={false}
          type="submit"
          variant="primary"
        />
      </div>
    </form>
  );
}
