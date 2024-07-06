"use client";
import { GlobalDrinkForm } from "../[slug]/context";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { formatText } from "@/utils/formatText";
import { enqueueSnackbar } from "notistack";
import { deleteDrink } from "../actions";
import { useModal } from "@/context/ModalContext";
import MartiniLoader from "@/components/UI/Loading";
import Button from "@/components/UI/Button";

interface Props {
  drink: GlobalDrinkForm;
  afterDelete: () => void;
}

export const DeleteForm: React.FC<Props> = ({ drink, afterDelete }) => {
  const { user } = useAuthenticatedContext();
  const { hideModal } = useModal();

  /**
   * Handles the form submission event.
   * @param e - The form event.
   */
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    hideModal();

    if (user?.id) {
      try {
        await deleteDrink(drink.id);
        enqueueSnackbar("Deleted", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          }
        });
        setTimeout(() => {
          afterDelete()
        }, 2000);
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
        <Button type="submit" label="Delete" variant="delete" />
      </div>
    </form>
  );
};

export default DeleteForm;
