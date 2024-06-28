"use client";
import React, { useState } from "react";
import TextInput from "@/components/Inputs/TextInput";
import TextArea from "@/components/Inputs/TextArea";
import Select from "@/components/Inputs/Select";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { enqueueSnackbar } from "notistack";
import { CreateDrinkFields } from "../models";
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
    setForm((prev) => ({ ...prev, [field]: value, unique_name: sanitizeInput(value)}));
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
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-[300px] md:max-w-lg w-screen">
      <div className="text-lg font-medium">Create Drink</div>
      <TextInput
        id="drinkName"
        label="Name"
        value={form.name}
        onChange={(value: string) => handleChange("name", value)}
        delay={500}
        minLength={3}
        maxLength={50}
        type="text"
        required
      />
      <Select
        label="Drink Type"
        required
        options={[
          { value: "cocktail", label: "Cocktail" },
          { value: "coffee", label: "Coffee" },
          { value: "juice", label: "Juice" },
          { value: "mocktail", label: "Mocktail" },
          { value: "shake", label: "Shake" },
          { value: "smoothie", label: "Smoothie" },
          { value: "tea", label: "Tea" },
          { value: "other", label: "Other" },
        ]}
        defaultValue={{ value: "cocktail", label: "Cocktail" }}
        onChange={(value: string) => handleChange("drink_type", value)}
      />
      <TextArea
        id="drinkDescription"
        label="Description"
        value={form.description}
        onChange={(value: string) => handleChange("description", value)}
        maxLength={250}
        error={isDescriptionTooLong ? "Description is too long" : ""}
      />
      
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateForm;
