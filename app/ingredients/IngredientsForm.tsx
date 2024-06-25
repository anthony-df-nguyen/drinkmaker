// components/IngredientForm.tsx

import React, { useState, useCallback } from "react";
import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";
import { sanitizeInput, validateInput } from "@/utils/sanitizeInput";
import { SupabaseClient } from "@supabase/supabase-js";
import { queryByIngredient, queryAllIngredients } from "@/app/ingredients/api";
import checkExisting from "@/utils/supabase/checkExisting";
import createRow from "@/utils/supabase/createRow";
import { enqueueSnackbar } from "notistack";
import { Ingredients } from "@/schema/ingredients";
import { formatText } from "@/utils/formatText";

interface IngredientFormProps {
  updateResults: React.Dispatch<React.SetStateAction<Ingredients[]>>;
  pg: SupabaseClient;
}

const IngredientForm: React.FC<IngredientFormProps> = ({ updateResults, pg }) => {
  const [currentValue, setCurrentValue] = useState<string>("");
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleName = useCallback(async (val: string) => {
    const cleanString = sanitizeInput(val);
    setCurrentValue(cleanString);
    const validString = validateInput(cleanString, { minLength: 3 });

    if (validString.isValid) {
      await queryByIngredient(pg, cleanString, updateResults);

      const exists = await checkExisting(pg, "ingredients", "name", cleanString);
      if (exists) {
        setEnableSubmit(false);
      } else {
        setErrorMessage("");
        setEnableSubmit(true);
      }
    } else {
      setErrorMessage(cleanString.length > 0 ? "Invalid input" : "");
      setEnableSubmit(false);
      if (cleanString.length === 0) {
        await queryAllIngredients(pg,updateResults)
      }
    }
  }, [pg, updateResults]);

  const handleSubmit = async () => {
    if (enableSubmit) {
      const success = await createRow<Ingredients>(pg, "ingredients", { name: currentValue });
      if (success) {
        setCurrentValue("");
        setEnableSubmit(false);
        await queryAllIngredients(pg,updateResults)
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
        error={errorMessage}
        placeholder="Enter an ingredient name"
        value={currentValue}
      />
      {currentValue.length > 2 && (
        <div className="text-center mt-4">
          <Button
            label="+ Add Ingredient"
            disabled={!enableSubmit}
            onClick={handleSubmit}
          />
        </div>
      )}
    </form>
  );
};

export default IngredientForm;