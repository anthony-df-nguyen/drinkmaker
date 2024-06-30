/**
 * Component for editing a drink in the view-only mode.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {DrinkSchema} props.drink - The drink object to be edited.
 * @param {Dispatch<SetStateAction<boolean>>} props.handleCancel - The function to handle canceling the edit mode.
 * @returns {JSX.Element} The JSX element representing the edit mode form.
 */
import { useState, SetStateAction, Dispatch } from "react";
import Editor from "../[slug]/instructions/editor/Editor";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomMultiSelect from "@/components/MUIInputs/MultiSelect";
import CustomSelect from "@/components/MUIInputs/Select";
import Tags, { TagOption } from "@/components/MUIInputs/Tags";
import Button from "@/components/UI/Button";
import { DrinkSchema, drinkTypes } from "../models";
import { updateDrink } from "../actions";
import { upsertDrinkIngredient } from "../[slug]/drink_ingredients/actions";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { enqueueSnackbar } from "notistack";
import { useListIngredients } from "@/app/ingredients/context/ListIngredientsContext";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
  handleCancel: Dispatch<SetStateAction<boolean>>;
}

const EditDrinkForm: React.FC<ViewOnlyModeProps> = ({
  drink,
  handleCancel,
}) => {
  const [form, setForm] = useState({ ...drink });
  console.log("form: ", form);

  const { allIngredients } = useListIngredients();

  const ingredientOptions = allIngredients.map((ingredient) => ({
    value: ingredient.id,
    label: ingredient.name,
  }));

  //const [selectedValues, setSelectedValues] = useState<string[]>(form.ingredients || []);

  /**
   * Handles the change of a form field.
   *
   * @param {keyof typeof form} field - The field to be changed.
   * @param {string} value - The new value of the field.
   */
  const handleChange = (
    field: keyof typeof form,
    value: string | TagOption[]
  ) => {
    if (field === "name") {
      setForm({
        ...form,
        name: value as string,
        unique_name: sanitizeInput(value as string),
      });
    } else if (field === "ingredients") {
      const mappedValues = (value as TagOption[]).map((option) => option.value);
      setForm({ ...form, ingredients: mappedValues });
    } else {
      setForm({ ...form, [field]: value as string });
    }
  };

  /**
   * Submits the form for updating the drink.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateDrink(drink.id, form)
        .then(() => {
          // Upsert the drink ingredients to the drink_ingredients table
          upsertDrinkIngredient(drink.id, form.ingredients as string[]);
        })
        .then(() => {
          // Close the edit form after updating the drink
          handleCancel(false);
          enqueueSnackbar("Successfully updated drink", { variant: "success" });
        });
    } catch (error) {
      console.error("Error updating drink: ", error);
      enqueueSnackbar("Error updating drink", { variant: "error" });
    }
  };

  const myDefault = ingredientOptions.filter((ingredient) =>
    form.ingredients?.includes(ingredient.value)
  );

  return (
    <form className="mt-8" onSubmit={submitForm}>
      {}
      <div className="grid gap-4">
        <DebouncedTextInput
          label="Name"
          value={drink.name}
          onChange={(value: string) => handleChange("name", value || "")}
          required
        />
        <DebouncedTextInput
          label="Description"
          value={drink.description}
          onChange={(value: string) => handleChange("description", value || "")}
          multiline
          minRows={3}
        />
        <CustomSelect
          label="Drink Type"
          required
          options={drinkTypes.filter((row) => row.value !== "all")}
          value={drink.drink_type}
          onChange={(value: string) => handleChange("drink_type", value)}
        />
        <Tags
          label="Ingredients"
          options={ingredientOptions}
          defaultValue={myDefault}
          placeholder="Select ingredients"
          onChange={(value: TagOption[]) => handleChange("ingredients", value)}
        />
        <div className="mt-4">
          <Editor
            initialContent={drink.instructions}
            onChangeHandler={handleChange}
          />
        </div>
      </div>

      {/* Editor */}
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
  );
};

export default EditDrinkForm;
