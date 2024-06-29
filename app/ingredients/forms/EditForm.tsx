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
import Button from "@/components/UI/Button";

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
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <form
      className="grid gap-4 max-w-[300px] md:max-w-lg w-screen"
      onSubmit={handleUpdate}
    >
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
        required
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
        <Button
          label="Update"
          type="submit"
          variant="primary"
        />
      </div>
    </form>
  );
};

export default EditIngredient;
