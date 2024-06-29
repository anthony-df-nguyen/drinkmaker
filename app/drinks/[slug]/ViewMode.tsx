"use client";
import { DrinkSchema } from "../models";
import { useModal } from "@/context/ModalContext";
import ViewInstructions from "./instructions/ViewInstructions";
import Card from "@/components/UI/Card";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
}

const ViewOnlyMode: React.FC<ViewOnlyModeProps> = ({
  drink
}) => {
  const { showModal } = useModal();

  return (
    <div>
    
      <Card className="mt-4 w-full text-base font-light">{drink.description ? drink.description : "No drink description"}</Card>
      <div className="mt-4">
        <ViewInstructions instructions={drink.instructions} />
      </div>
    </div>
  );
};

export default ViewOnlyMode;
