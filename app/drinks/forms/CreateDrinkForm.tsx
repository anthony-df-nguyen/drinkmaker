"use client";
import React, { useState } from "react";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import Select from "@/components/MUIInputs/Select";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { enqueueSnackbar } from "notistack";
import { CreateDrinkFields, drinkTypes } from "../models";
import { createDrink } from "../actions";
import { useModal } from "@/context/ModalContext";
import { sanitizeInput } from "@/utils/sanitizeInput";

/**
 * Component for creating a new drink.
 */
const CreateForm = () => {
  const { user } = useAuthenticatedContext();
  const { hideModal } = useModal();

  const [form, setForm] = useState<CreateDrinkFields>({
    name: "",
    unique_name: "",
    description: "",
    created_by: "",
    drink_type: "cocktail",
  });

  /**
   * Handles the change event for the form fields.
   * @param field - The field to update.
   * @param value - The new value for the field.
   */
  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        unique_name: sanitizeInput(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Handles the form submission event.
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      try {
        await createDrink({ ...form, created_by: user.id });
        enqueueSnackbar("Drink created successfully", {
          variant: "success",
        });
        hideModal();
      } catch (error) {
        enqueueSnackbar("Cannot create drink", {
          variant: "error",
        });
      }
    } else {
      console.error("User is not authenticated");
      enqueueSnackbar("You must be authenticated to create a drink", {
        variant: "error",
      });
    }
  };

  const isDescriptionTooLong = form.description.length > 10000;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 max-w-[300px] md:max-w-lg w-screen"
    >
      <div className="text-lg font-medium">Create Drink</div>
      <div className="grid gap-4">
        <DebouncedTextInput
          label="Name"
          value={form.name}
          onChange={(value: string) => handleChange("name", value)}
          delay={500}
          required
        />
         <Select
          label="Drink Type"
          required
          options={drinkTypes.filter((row) => row.value !== "all")}
          value={"cocktail"}
          onChange={(value: string) => handleChange("drink_type", value)}
        />
        <DebouncedTextInput
          label="Description"
          value={form.description}
          onChange={(value: string) => handleChange("description", value)}
          error={isDescriptionTooLong ? "Description is too long" : ""}
          multiline
          minRows={3}
        />
       
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateForm;
