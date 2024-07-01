/**
 * Component for displaying and editing drink instructions.
 */
"use client";
import React, { useEffect, useState } from "react";
import { InstructionFormat } from "./models";
import { upsertDrinkInstruction, getDrinkInstructionByID } from "./actions";
import Editor from "./editor/Editor";
import ViewOnlyQuill from "./editor/ViewOnlyQuill";
import Button from "@/components/UI/Button";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { enqueueSnackbar } from "notistack";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Card from "@/components/UI/Card";

interface DrinkInstructionsProps {
  drinkID: string;
}

/**
 * Component for displaying and editing drink instructions.
 * @param {DrinkInstructionsProps} props - The component props.
 * @param {string} props.drinkID - The ID of the drink.
 * @returns {JSX.Element} The rendered component.
 */
const DrinkInstructions: React.FC<DrinkInstructionsProps> = ({ drinkID }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  const [instructions, setInstructions] = useState<InstructionFormat | null>(
    null
  );
  const [firstLoadContent, setFirstLoadContent] =
    useState<InstructionFormat | null>(null); // [1

  useEffect(() => {
    try {
      /**
       * Fetches the drink instructions by ID.
       * @param {string} drinkID - The ID of the drink.
       * @returns {Promise<void>} A promise that resolves when the instructions are fetched.
       */
      getDrinkInstructionByID(drinkID).then((data) => {
        if (data?.instructions) {
          setInstructions(data.instructions);
          setFirstLoadContent(data.instructions);
        }
      });
    } catch (error) {
      console.error("Failed to fetch instructions:", error);
      enqueueSnackbar("Failed to fetch instructions", { variant: "error" });
    }
  }, [drinkID]);

  /**
   * Handles the form submission.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      /**
       * Upserts the drink instructions.
       * @param {string} drinkID - The ID of the drink.
       * @param {InstructionFormat | null} instructions - The instructions to be upserted.
       * @returns {Promise<void>} A promise that resolves when the instructions are upserted.
       */
      upsertDrinkInstruction(drinkID, instructions).then(() => {
        setEditMode(false);
        enqueueSnackbar("Instructions updated", { variant: "success" });
      });
    } catch (error) {
      console.error("Failed to upsert instructions:", error);
      enqueueSnackbar("Failed to update instructions", { variant: "error" });
    }
  };

  return (
    <div onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="w-full">
        <form onSubmit={handleSubmit} className="w-full grid gap-4">
          <div className="flex justify-between w-full">
            <div className="grid items-center gap-4">
              <div className="pageTitle mb-2">Instructions</div>
            </div>

            {hover && !editMode && <div
            className="w-8 h-8 cursor-pointer"
            onClick={() => setEditMode(true)}
          >
            <PencilSquareIcon color="gray"/>
          </div>}
          </div>
          {editMode ? (
            <Editor
              initialContent={firstLoadContent}
              onChangeHandler={setInstructions}
            />
          ) : (
            <ViewOnlyQuill initialContent={firstLoadContent} />
          )}
          {editMode && (
            <div className="flex justify-end gap-4">
              <Button
                label="Cancel"
                type="button"
                variant="cancel"
                onClick={() => setEditMode(false)}
              />
              <Button label="Submit" type="submit" variant="primary" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DrinkInstructions;
