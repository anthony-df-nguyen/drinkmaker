"use client";
import React, { useState, useCallback, useEffect } from "react";
import { MutableIngredientFields, IngredientsSchema } from "../models";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { sanitizeInput } from "@/utils/sanitizeInput";
import TextInput from "@/components/UI/input";
import TextArea from "@/components/UI/textarea";
import { enqueueSnackbar } from "notistack";
import { updateIngredient } from "../actions";
import { useModal } from "@/context/ModalContext";
import { formatText } from "@/utils/formatText";
import {Button} from "@/components/UI/Button";

interface Props {
  ingredient: IngredientsSchema;
}

export const EditIngredient: React.FC<Props> = ({ ingredient }) => {
  const { user } = useAuthenticatedContext();
  const { hideModal } = useModal();

  const [form, setForm] = useState<MutableIngredientFields>({
    name: ingredient.name,
    image: ingredient.image || "",
  });

  const handleChange = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((prevForm) => ({
        ...prevForm,
        [field]: field === "name" ? sanitizeInput(value) : value,
      }));
    },
    []
  );

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
        label="Name"
        value={formatText(form.name || "")}
        onChange={(value: string) => handleChange("name", value)}
        required
      />
      <TextArea
        label="Image URL"
        value={form.image ?? ""}
        onChange={(value: string) => handleChange("image", value || "")}
        rows={2}
      />
      <div className="flex items-center justify-end">
        <Button type="submit" variant="default">Update</Button>
      </div>
    </form>
  );
};

export default EditIngredient;