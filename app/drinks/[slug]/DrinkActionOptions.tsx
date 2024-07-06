"use client";
import React from "react";
import { CustomMenuItem } from "@/components/UI/ActionDrop";
import { GlobalDrinkForm } from "./context";
import ActionDrop from "@/components/UI/ActionDrop";
import {
  PencilSquareIcon,
  TrashIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import DeleteForm from "../forms/DeleteDrinkForm";
import { useRouter } from "next/navigation";
import { useAuthenticatedContext } from "@/context/Authenticated";

interface DrinkActionOptionsProps {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  drink: GlobalDrinkForm;
  drinkCreator: string;
}

const DrinkActionOptions: React.FC<DrinkActionOptionsProps> = ({
  setEdit,
  drink,
  drinkCreator,
}) => {
  const {user} = useAuthenticatedContext();
  const { showModal } = useModal();
  const router = useRouter();
  const handleDelete = () => {
    router.push("/");
  };
  return (
    <ActionDrop label="Options">
      <div>
        <CustomMenuItem icon={ShareIcon} onClick={() => {}} isLink={false}>
          Share
        </CustomMenuItem>
        <CustomMenuItem icon={HeartIcon} onClick={() => {}} isLink={false}>
          Favorite
        </CustomMenuItem>
        {user?.id === drinkCreator && (
          <CustomMenuItem
            icon={PencilSquareIcon}
            onClick={() => setEdit(true)}
            isLink={false}
          >
            Edit
          </CustomMenuItem>
        )}
        {user?.id === drinkCreator && (
          <CustomMenuItem
            icon={TrashIcon}
            onClick={() =>
              showModal(<DeleteForm drink={drink} afterDelete={handleDelete} />)
            }
            isLink={false}
          >
            Delete
          </CustomMenuItem>
        )}
      </div>
    </ActionDrop>
  );
};

export default DrinkActionOptions;
