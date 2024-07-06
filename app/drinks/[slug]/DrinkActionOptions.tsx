import React from "react";
import { CustomMenuItem } from "@/components/UI/ActionDrop";
import { GlobalDrinkForm } from "./context";
import ActionDrop from "@/components/UI/ActionDrop";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import DeleteForm from "../forms/DeleteDrinkForm";
import { useRouter } from "next/navigation";

interface DrinkActionOptionsProps {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  drink: GlobalDrinkForm;
}

const DrinkActionOptions: React.FC<DrinkActionOptionsProps> = ({ setEdit, drink }) => {
  const { showModal } = useModal();
  const router = useRouter();
  const handleDelete = () => {
    router.push("/");
  }
  return (
    <ActionDrop label="Options">
      <div>
        <CustomMenuItem
          icon={PencilSquareIcon}
          onClick={() => setEdit(true)}
          isLink={false}
        >
          Edit
        </CustomMenuItem>
        <CustomMenuItem
          icon={TrashIcon}
          onClick={() => showModal(<DeleteForm drink={drink} afterDelete={handleDelete} />)}
          isLink={false}
        >
          Delete
        </CustomMenuItem>
      </div>
    </ActionDrop>
  );
};

export default DrinkActionOptions;
