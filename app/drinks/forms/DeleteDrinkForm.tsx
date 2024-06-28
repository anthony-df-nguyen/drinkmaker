"use client";
import React from "react";
import { DrinkSchema } from "../models";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { formatText } from "@/utils/formatText";
import { enqueueSnackbar } from "notistack";
import { deleteDrink } from "../actions";
import { useModal } from "@/context/ModalContext";

interface Props {
  drink: DrinkSchema;
}

export const DeleteForm: React.FC<Props> = ({ drink }) => {
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
        await deleteDrink(drink.id);
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
      <div className="text-lg font-medium">Delete Drink</div>
      <div>
        Are you sure you wish to delete{" "}
        <span className="font-bold">{formatText(drink.name)}?</span>
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
