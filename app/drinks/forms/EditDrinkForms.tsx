"use client";
import React, { useState } from "react";
import { MutableDrinkFields, DrinkSchema } from "../models";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { formatText } from "@/utils/formatText";
import { sanitizeInput } from "@/utils/sanitizeInput";
import TextInput from "@/components/Inputs/TextInput";
import TextArea from "@/components/Inputs/TextArea";
import { updateDrink } from "../actions";
import { enqueueSnackbar } from "notistack";
import { useModal } from "@/context/ModalContext";

interface Props {
  drink: DrinkSchema;
}

export const EditDrinksForm: React.FC<Props> = ({ drink }) => {
  const { user } = useAuthenticatedContext();
  const { hideModal } = useModal();

  const [form, setForm] = useState<MutableDrinkFields>(drink);
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value});
  };

  /**
   * Handles the form submission event.
   * @param e - The form event.
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      try {
        await updateDrink(drink.id, form);
        enqueueSnackbar("Drink updated successfully", {
          variant: "success",
        });
        hideModal();
      } catch (error) {
        enqueueSnackbar("Cannot update drink", {
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
  return (
    <form
      onSubmit={handleUpdate}
      className="grid gap-4 max-w-[300px] md:max-w-lg w-screen"
    >
      <div className="text-lg font-medium">Edit Drink</div>
      <TextInput
        id="drinkName"
        label="Name"
        value={formatText(drink.name)}
        onChange={(value: string) => handleChange("name", value || "")}
        delay={500}
        minLength={3}
        maxLength={50}
        type="text"
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

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default EditDrinksForm;
