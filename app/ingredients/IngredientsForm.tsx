// components/IngredientForm.tsx

import React, { useState } from "react";
import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";
import { sanitizeInput, validateInput } from "@/utilities/sanitizeInput";
import { useSupabase } from "@/context/Supabase";
import checkExisting from "@/utilities/supabase/checkExisting";
import createRow from "@/utilities/supabase/createRow";
import { enqueueSnackbar } from "notistack";
import { Ingredients } from "@/schema/ingredients";

interface IngredientFormProps {
  onSuccess: () => void;
  onChange: (value: string) => void;
}

const IngredientForm: React.FC<IngredientFormProps> = ({
  onSuccess,
  onChange,
}) => {
  const [currentValue, setCurrentValue] = useState<string>("");
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const pg = useSupabase();

  const handleName = async (val: string) => {
    const cleanString = sanitizeInput(val);
    setCurrentValue(cleanString);
    const validString = validateInput(cleanString, { minLength: 3 });

    if (validString.isValid) {
      // Search through ingredients to display list of search results
      onChange(currentValue);

      //Check if there is an exact match
      const exists = await checkExisting(
        pg,
        "ingredients",
        "name",
        cleanString
      );
      //If there is don't allow user to submit it
      if (exists) {
        setErrorMessage("This ingredient already exists");
        setEnableSubmit(false);
      } 
      // If it doesn't exist, allow user to submit it
      else {
        setErrorMessage("");
        setEnableSubmit(true);
      }
    }
    // Reset the input logic
    else {
      setErrorMessage(cleanString.length > 0 ? "Invalid input" : "");
      setEnableSubmit(false);
      //Show all results again
      onSuccess();
    }
  };

  const handleSubmit = async () => {
    if (enableSubmit) {
      const success = await createRow<Ingredients>(pg, "ingredients", {
        name: currentValue,
      });
      enqueueSnackbar(
        `${
          success ? "Successfully added" : "Failed to add"
        } ${currentValue} to database`,
        { variant: success ? "success" : "error" }
      );
      if (success) {
        setCurrentValue(""); // Reset the text input
        setEnableSubmit(false); // Disable submit button after reset
        onSuccess(); // Call onSuccess to refresh the list
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
        delay={500}
        minLength={3}
        error={errorMessage}
        placeholder="Enter an ingredient name"
      />
      <div className="text-center mt-4">
        <Button
          label="+ Add Ingredient"
          disabled={!enableSubmit}
          onClick={handleSubmit}
        />
      </div>
    </form>
  );
};

export default IngredientForm;
