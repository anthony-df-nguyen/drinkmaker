/**
 * Represents a form for adding ingredients.
 * @returns {JSX.Element} The ingredient form component.
 */
import React, { useState, useCallback, useRef } from "react";
import TextInput from "@/components/MUIInputs/TextInput";
import { useListIngredients } from "../context/ListIngredientsContext";
import Button from "@/components/UI/Button";
import { sanitizeInput, validateInput } from "@/utils/sanitizeInput";
import {
  createIngredient,
  searchForIngredient,
  queryIngredientsWithCount,
} from "@/app/ingredients/actions";
import checkExisting from "@/utils/supabase/checkExisting";
import { enqueueSnackbar } from "notistack";

const SearchCreate: React.FC = () => {
  const { setIngredients, setCount, setMode, refreshBrowseFirstPage } = useListIngredients();

  /**
   * Displays a snackbar notification.
   * @param {string} message - The message to display in the snackbar.
   * @param {"error" | "success"} variant - The variant of the snackbar (error or success).
   */
  const displaySnackbar = (message: string, variant: "error" | "success") => {
    enqueueSnackbar(message, { variant });
  };

  const requestIdRef = useRef(0);

  /**
   * Handles the input value for the ingredient name.
   * @param {string} val - The input value for the ingredient name.
   */
  const handleName = useCallback(async (val: string) => {
    const requestId = ++requestIdRef.current;

    // Sanitize and validate the input
    const cleanString = sanitizeInput(val);
    const validString = validateInput(cleanString, { minLength: 3 });

    // If the input is valid
    if (validString.isValid) {
      try {
        setMode("search");
        // Search for the ingredient and update the list of displayed results
        const data = await searchForIngredient(cleanString);
        if (requestIdRef.current !== requestId) return;
        console.log("data: ", data);
        setIngredients(data);
        // Do NOT setCount here: `count` represents total ingredients for pagination.
        // The list component will treat this as filtered/search mode.

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
        // Mark as browse and restore the canonical first page + total count.
        setMode("browse");

        refreshBrowseFirstPage()
          .then(() => {
            // Ensure the list isn't overwritten by any stale in-flight search response.
            requestIdRef.current = requestId;
          })
          .catch((error) => {
            console.error("Failed to fetch all ingredients:", error);
            displaySnackbar("Could not fetch ingredients", "error");
          });
      }
    }
  }, [refreshBrowseFirstPage, setCount, setIngredients, setMode]);

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

  const [formState, setFormState] = useState({
    displayValue: "",
    cleanValue: "",
    enableSubmit: false,
    errorMessage: "",
  });

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <TextInput
          label="Name"
          onChange={handleName}
          delay={1500}
          required
          variant="filled"
          size="small"
          focused
          placeholder="Enter an ingredient name to search or create"
          value={formState.displayValue}
          error={formState.errorMessage ? true : false}
          helperText={formState.errorMessage}
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
