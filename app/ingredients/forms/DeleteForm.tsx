"use client";
import React from "react";
import { IngredientsSchema } from "../models";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { formatText } from "@/utils/formatText";
import { enqueueSnackbar } from "notistack";
import { deleteIngredient } from "../actions";
import { useModal } from "@/context/ModalContext";

interface Props {
  ingredient: IngredientsSchema;
}

export const DeleteForm: React.FC<Props> = ({ ingredient }) => {
  const { user } = useAuthenticatedContext();
  const { hideModal } = useModal();

  /**
   * Handles the form submission event.
   * @param e - The form event.
   */
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      try {
        await deleteIngredient(ingredient.id);
        enqueueSnackbar("Ingredient deleted successfully", {
          variant: "success",
        });
        hideModal();
      } catch (error) {
        enqueueSnackbar("Cannot delete ingredient", {
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
    <form onSubmit={handleDelete} className="grid gap-4 max-w-[300px] w-screen">
      <div className="text-lg font-medium">Delete Ingredient</div>
      <div>
        Are you sure you wish to delete{" "}
        <span className="font-bold">{formatText(ingredient.name)}?</span>
        <br />
        <span className="text-xs">
          This will also delete any recipes this ingredient is linked to. This
          cannot be undone.
        </span>
      </div>
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default DeleteForm;
