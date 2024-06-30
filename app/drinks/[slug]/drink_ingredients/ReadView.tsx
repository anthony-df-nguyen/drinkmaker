// ReadView.tsx
import React from "react";
import Card from "@/components/UI/Card";
import { TagOption } from "@/components/MUIInputs/Tags";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

interface ReadViewProps {
  activeSelection: TagOption[];
  setEditMode: (editMode: boolean) => void;
  hover: boolean;
}

const ReadView: React.FC<ReadViewProps> = ({
  activeSelection,
  setEditMode,
  hover,
}) => {
  return (
    <Card className="w-full">
      <div className="flex justify-between w-full">
        <div className="grid items-center gap-2">
          <div className="pageTitle mb-2">Ingredients</div>
          <div>
            {activeSelection.map((row) => (
              <div key={row.value}>{row.label}</div>
            ))}
          </div>
        </div>
        {hover && (
          <div
            className="w-8 h-8 cursor-pointer"
            onClick={() => setEditMode(true)}
          >
            <PencilSquareIcon />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReadView;
