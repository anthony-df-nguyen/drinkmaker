"use client";
import React, { useState } from "react";
import { MutableIngredientFields, IngredientsSchema } from "../models";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { formatText } from "@/utils/formatText";
import { sanitizeInput } from "@/utils/sanitizeInput";
import TextInput from "@/components/Inputs/TextInput";
import TextArea from "@/components/Inputs/TextArea";
import { enqueueSnackbar } from "notistack";
import { updateIngredient } from "../actions";
import { useModal } from "@/context/ModalContext";

interface Props {
  ingredient: IngredientsSchema;
}

export const EditIngredient: React.FC<Props> = ({ ingredient }) => {
  const { user } = useAuthenticatedContext();
  const { hideModal } = useModal();

  const [form, setForm] = useState<MutableIngredientFields>(ingredient);
  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "name") {
      setForm({ ...form, name: sanitizeInput(value) });
    } else {
      setForm({ ...form, image: value });
    }
  };

  /**
   * Handles the form submission event.
   * @param e - The form event.
   */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      try {
        await updateIngredient(ingredient.id, form);
        enqueueSnackbar("Ingredient updated successfully", {
          variant: "success",
        });
        hideModal();
      } catch (error) {
        enqueueSnackbar("Cannot update ingredient", {
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
    <form onSubmit={handleUpdate} className="grid gap-4 max-w-[300px] w-screen">
      <div className="text-lg font-medium">Edit Ingredient</div>
      <TextInput
        id="drinkName"
        label="Name"
        value={formatText(ingredient.name)}
        onChange={(value: string) => handleChange("name", value || "")}
        delay={500}
        minLength={3}
        maxLength={50}
        type="text"
      />
      <TextArea
        id="drinkName"
        label="Image URL"
        value={ingredient.image || ""}
        onChange={(value: string) => handleChange("image", value)}
        delay={500}
        minLength={3}
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

export default EditIngredient;
