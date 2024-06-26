/**
 * Represents a form for adding ingredients.
 * @param {React.Dispatch<React.SetStateAction<Ingredients[]>>} updateResults - A function to update the list of ingredients.
 * @returns {JSX.Element} The ingredient form component.
 */
import React, { useState, useCallback } from "react";
import TextInput from "@/components/Inputs/TextInput";
import Button from "@/components/UI/Button";
import { sanitizeInput, validateInput } from "@/utils/sanitizeInput";
import {
  createIngredient,
  searchForIngredient,
  queryAllIngredients,
} from "@/app/ingredients/actions";
import checkExisting from "@/utils/supabase/checkExisting";
import { Ingredients } from "./models";
import { enqueueSnackbar } from "notistack";

interface IngredientFormProps {
  updateResults: React.Dispatch<React.SetStateAction<Ingredients[]>>;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ updateResults }) => {
  const [formState, setFormState] = useState({
    currentValue: "",
    enableSubmit: false,
    errorMessage: "",
  });

  /**
   * Displays a snackbar notification.
   * @param {string} message - The message to display in the snackbar.
   * @param {"error" | "success"} variant - The variant of the snackbar (error or success).
   */
  const displaySnackbar = (message: string, variant: "error" | "success") => {
    enqueueSnackbar(message, { variant });
  };

  /**
   * Handles the input value for the ingredient name.
   * @param {string} val - The input value for the ingredient name.
   */
  const handleName = useCallback(async (val: string) => {
    const cleanString = sanitizeInput(val);
    const validString = validateInput(cleanString, { minLength: 3 });

    // If the input is valid
    if (validString.isValid) {
      try {
        // Search for the ingredient and update the list of displayed results
        const data = await searchForIngredient(cleanString);
        updateResults(data);

        // Check if the ingredient already exists
        const exists = await checkExisting("ingredients", "name", cleanString);

        //If it does disable the create button otherwise disable it
        setFormState({
          currentValue: cleanString,
          enableSubmit: !exists,
          errorMessage: "",
        });
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
        displaySnackbar("Could not fetch ingredients", "error");
      }
    }
    // If input is invalid 
    else {
      // Do not allow creation
      setFormState((prevState) => ({
        ...prevState,
        currentValue: cleanString,
        enableSubmit: false,
        errorMessage: cleanString.length > 0 ? "Invalid input" : "",
      }));
      // If the input is empty, fetch all ingredients
      if (cleanString.length === 0) {
        queryAllIngredients().then(updateResults).catch((error) => {
          console.error("Failed to fetch all ingredients:", error);
          displaySnackbar("Could not fetch ingredients", "error");
        });
      }
    }
  }, [updateResults]);

  /**
   * Handles the form submission.
   */
  const handleSubmit = async () => {
    if (formState.enableSubmit) {
      try {
        await createIngredient({ name: formState.currentValue });
        displaySnackbar("Ingredient added", "success");
      } catch (error) {
        console.error("Failed to create ingredient:", error);
        displaySnackbar("Could not add ingredient", "error");
      }
    }
  };

  return (
    <form>
      <TextInput
        id="name"
        type="text"
        label="Name"
        onChange={handleName}
        delay={1000}
        minLength={3}
        error={formState.errorMessage}
        placeholder="Enter an ingredient name to search or create"
        value={formState.currentValue}
      />
      {formState.currentValue.length > 2 && (
        <div className="text-center mt-4">
          <Button
            label="+ Add Ingredient"
            disabled={!formState.enableSubmit}
            onClick={handleSubmit}
          />
        </div>
      )}
    </form>
  );
};

export default IngredientForm;
