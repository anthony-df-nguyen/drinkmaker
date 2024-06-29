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
import TextInput from "@/components/Inputs/TextInput";
import TextArea from "@/components/Inputs/TextArea";
import Select from "@/components/Inputs/Select";
import Button from "@/components/UI/Button";
import { DrinkSchema, drinkTypes } from "../models";
import { updateDrink } from "../actions";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { enqueueSnackbar } from "notistack";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
  handleCancel: Dispatch<SetStateAction<boolean>>;
}

const EditDrinkForm: React.FC<ViewOnlyModeProps> = ({
  drink,
  handleCancel,
}) => {
  const [form, setForm] = useState({ ...drink });

  /**
   * Handles the change of a form field.
   *
   * @param {keyof typeof form} field - The field to be changed.
   * @param {string} value - The new value of the field.
   */
  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "name") {
      setForm({ ...form, name: value, unique_name: sanitizeInput(value) });
    } else {
      setForm({ ...form, [field]: value });
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
      await updateDrink(drink.id, form).then(() => {
        // Close the edit form afetr updating the drink
        handleCancel(false);
        enqueueSnackbar("Successfully updated drink", { variant: "success" });
      });
    } catch (error) {
      console.error("Error updating drink: ", error);
      enqueueSnackbar("Error updating drink", { variant: "error" });
    }
  };

  return (
    <form className="mt-8" onSubmit={submitForm}>
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
        options={drinkTypes}
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
