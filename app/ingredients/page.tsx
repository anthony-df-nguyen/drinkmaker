"use client";
import React, { useState } from "react";
import Navigation from "@/components/Layout/Navigation";
import Button from "@/components/UI/Button";
import TextInput from "@/components/UI/TextInput";
import { Ingredients } from "@/schema/ingredients";
import { sanitizeInput, validateInput } from "@/utilities/sanitizeInput";
import { useSupabase } from "@/context/Supabase";
import checkExisting from "@/utilities/supabase/checkExisting";
import createRow from "@/utilities/supabase/createRow";
import { enqueueSnackbar } from "notistack";

type Props = {};

export default function Page({}: Props) {
  const [currentValue, updateValue] = useState<string>("");
  const [enableSubmit, handleEnableSubmit] = useState<boolean>(false);
  // const [error, updateError] = useState(false);
  const [errorMessage, updateErrorMessage] = useState("");
  const pg = useSupabase();

  // When user types in a value, check if the database already has an entry for this ingredient
  const handleName = async (val: string) => {
    const cleanString = sanitizeInput(val);
    updateValue(cleanString);
    const validString = validateInput(cleanString, { minLength: 3 });

    // If there is no input error check if this already exists
    if (validString.isValid) {
      // Check if this already exists
      const exists = await checkExisting(
        pg,
        "ingredients",
        "name",
        cleanString
      );
      //If it exists, show error and don't allow submissions
      if (exists) {
        updateErrorMessage("This ingredient already exists");
        handleEnableSubmit(false);
      }
      // If it doesn't allow the user to submit the entry
      else {
        updateErrorMessage("");
        handleEnableSubmit(true);
      }
    }
    // If there is some other invalid entry error, show error
    else if (!validString.isValid && cleanString.length > 0) {
      updateErrorMessage("Invalid input");
      handleEnableSubmit(false);
    } else {
      updateErrorMessage("");
      handleEnableSubmit(false);
    }
  };

  const handleSubmit = async () => {
    if (enableSubmit) {
      const insertRow = await createRow<Ingredients>(pg, "ingredients", {
        name: currentValue,
      });
      insertRow
        ? enqueueSnackbar(`Successfully added ${currentValue} to database`, {
            variant: "success",
          })
        : enqueueSnackbar(`Failed to add ${currentValue} to database`, {
            variant: "error",
          });
    }
  };
  return (
    <Navigation>
      <div>
        <h1>Add Ingredients</h1>
        <form className="">
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
              label="Submit"
              disabled={!enableSubmit}
              onClick={() => {
                handleSubmit();
              }}
            />
          </div>
        </form>
      </div>
    </Navigation>
  );
}
