import React from "react";
import { CustomMenuItem } from "@/components/UI/ActionDrop";
import ActionDrop from "@/components/UI/ActionDrop";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";

interface DrinkActionOptionsProps {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  // handleDelete: () => void;
}

const DrinkActionOptions: React.FC<DrinkActionOptionsProps> = ({ setEdit }) => {
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
          onClick={() => alert("Delete")}
          isLink={false}
        >
          Delete
        </CustomMenuItem>
      </div>
    </ActionDrop>
  );
};

export default DrinkActionOptions;
