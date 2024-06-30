"use client";
import { DrinkSchema } from "../models";
import { useModal } from "@/context/ModalContext";
import ViewInstructions from "./instructions/ViewInstructions";
import Card from "@/components/UI/Card";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
}

const ViewOnlyMode: React.FC<ViewOnlyModeProps> = ({ drink }) => {
  const { showModal } = useModal();
  const { description, instructions } = drink;

  return (
    <div>
      <Card className="mt-4 w-full text-base font-light">
        {description ? (
          <div>
            <div className="text-xl font-medium mb-4">Description</div>
            <div>{description}</div>
          </div>
        ) : (
          "No drink description"
        )}
      </Card>
      <div className="mt-4">
        <ViewInstructions instructions={instructions} />
      </div>
    </div>
  );
};

export default ViewOnlyMode;
