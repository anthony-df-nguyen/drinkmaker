"use client";
import { useState, useEffect, useCallback } from "react";
import { DrinkSchema } from "../models";
import { InstructionFormat } from "./instructions/models";
import Badge from "@/components/UI/Badge";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import EditDrinksForm from "../forms/EditDrinkForms";
import DeleteForm from "../forms/DeleteDrinkForm";
import ViewInstructions from "./instructions/ViewInstructions";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
}

const ViewOnlyMode: React.FC<ViewOnlyModeProps> = ({
  drink
}) => {
  const { showModal } = useModal();

  return (
    <div>
    
      <div className="mt-8">{drink.description}</div>
      <div className="mt-4">
        <ViewInstructions instructions={drink.instructions} />
      </div>
    </div>
  );
};

export default ViewOnlyMode;
