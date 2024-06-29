/**
 * Represents a form for adding ingredients.
 * @returns {JSX.Element} The ingredient form component.
 */
import React, { useState, useCallback } from "react";
import TextInput from "@/components/Inputs/TextInput";
import { useListIngredients } from "../context/ListIngredientsContext";
import Button from "@/components/UI/Button";
import { sanitizeInput, validateInput } from "@/utils/sanitizeInput";
import {
  createIngredient,
  searchForIngredient,
  queryAllIngredients,
} from "@/app/ingredients/actions";
import checkExisting from "@/utils/supabase/checkExisting";
import { enqueueSnackbar } from "notistack";

const SearchCreate: React.FC = () => {
  const [formState, setFormState] = useState({
    displayValue: "",
    cleanValue: "",
    enableSubmit: false,
    errorMessage: "",
  });
  const { ingredients, setIngredients, count, setCount } = useListIngredients();

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
        console.log('data: ', data);
        setIngredients(data);
        setCount(data.length)

        // Check if the ingredient already exists
        const exists = await checkExisting("ingredients", "name", cleanString);

        //If it does disable the create button
        if (exists) {
          setFormState({
            displayValue: val,
            cleanValue: cleanString,
            enableSubmit: false,
            errorMessage: "",
          });
        } else {
          // If it does not exist, enable the create button
          setFormState({
            displayValue: val,
            cleanValue: cleanString,
            errorMessage: "",
            enableSubmit: true,
          });
        }
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
        displayValue: val,
        cleanValue: cleanString,
        enableSubmit: false,
        errorMessage: cleanString.length > 0 ? "Invalid input" : "",
      }));
      // If the input is empty, fetch all ingredients
      if (cleanString.length === 0) {
        queryAllIngredients(1, 10)
          .then((data) => setIngredients(data))
          .catch((error) => {
            console.error("Failed to fetch all ingredients:", error);
            displaySnackbar("Could not fetch ingredients", "error");
          });
      }
    }
  }, []);

  /**
   * Handles the form submission.
   */
  const handleSubmit = async () => {
    if (formState.enableSubmit) {
      try {
        await createIngredient({ name: formState.cleanValue });
        displaySnackbar("Ingredient added", "success");
        setFormState({
          displayValue: "",
          cleanValue: "",
          enableSubmit: false,
          errorMessage: "",
        });
      } catch (error) {
        console.error("Failed to create ingredient:", error);
        displaySnackbar("Could not add ingredient", "error");
      }
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <TextInput
        id="name"
        type="text"
        label="Name"
        onChange={handleName}
        delay={1000}
        minLength={3}
        error={formState.errorMessage}
        placeholder="Enter an ingredient name to search or create"
        value={formState.displayValue}
      />
      {formState.displayValue.length > 2 && (
        <div className="text-center mt-4">
          <Button
            label="+ Add Ingredient"
            disabled={!formState.enableSubmit}
            type="submit"
            variant="primary"
          />
        </div>
      )}
    </form>
  );
};

export default SearchCreate;
