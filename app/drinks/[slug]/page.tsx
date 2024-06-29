"use client";
import { useState, useEffect, useCallback } from "react";
import ViewOnlyMode from "./ViewMode";
import EditMode from "./EditMode";
import { DrinkSchema } from "../models";
import { InstructionFormat } from "./instructions/models";
import { getDrinkByID } from "../actions";
import Navigation from "@/components/Layout/Navigation";
import { enqueueSnackbar } from "notistack";
import Badge from "@/components/UI/Badge";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useModal } from "@/context/ModalContext";
import DeleteForm from "../forms/DeleteDrinkForm";

import { getDrinkInstructionByID } from "./instructions/actions";

const Page: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { slug } = params;
  const { showModal } = useModal();
  const [drinkData, setDrinkData] = useState<DrinkSchema>();
  const [drinkInstructions, setDrinkInstructions] =
    useState<InstructionFormat>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getDrinkByID(slug);
      setDrinkData(data);
    } catch (error) {
      enqueueSnackbar(`Error loading ${slug}`, { variant: "error" });
    }
  }, [slug]);

  const fetchInstructions = useCallback(async () => {
    if (!drinkData?.id) return;
    try {
      const data = await getDrinkInstructionByID(drinkData.id);
      setDrinkInstructions(data?.instructions ?? null);
    } catch (error) {
      enqueueSnackbar(`Error loading instructions`, { variant: "error" });
    }
  }, [drinkData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchInstructions();
  }, [fetchInstructions]);

  const renderContent = () => {
    return drinkData && (
      <div>
        <div>
          <div className="flex items-center gap-2">
            <div className="pageTitle flex-1">{drinkData.name}</div>
            <div
              className="text-gray-500 w-8 h-8 cursor-pointer"
              onClick={() => setEditMode(true)}
            >
              <PencilSquareIcon />
            </div>
            <div
              className="text-gray-500 w-8 h-8 cursor-pointer"
              onClick={() => showModal(<DeleteForm drink={drinkData} />)}
            >
              <TrashIcon />
            </div>
          </div>
          <div>
            <Badge label={drinkData.drink_type} color="bg-blue-100" />
          </div>
        </div>
        {!editMode && <ViewOnlyMode drink={drinkData} />}
        {editMode && <EditMode drink={drinkData} />}
      </div>
    );
  };

  return (
    <Navigation>
      <main>{renderContent()}</main>
    </Navigation>
  );
};

export default Page;
