/**
 * Component for displaying and editing drink instructions.
 */
"use client";
import React, { useEffect, useState } from "react";
import { InstructionFormat } from "./models";
import { upsertDrinkInstruction, getDrinkInstructionByID } from "./actions";
import Editor from "./editor/Editor";
import ViewOnlyQuill from "./editor/ViewOnlyQuill";
import { useGlobalDrinkForm } from "../context";
import Button from "@/components/UI/Button";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { enqueueSnackbar } from "notistack";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Card from "@/components/UI/Card";

/**
 * Component for displaying and editing drink instructions.
 * @param {DrinkInstructionsProps} props - The component props.
 * @param {string} props.drinkID - The ID of the drink.
 * @returns {JSX.Element} The rendered component.
 */
const DrinkInstructions: React.FC = () => {
  const { globalDrinkForm } = useGlobalDrinkForm();
  const [instructions, setInstructions] = useState<InstructionFormat | null>(
    globalDrinkForm?.instructions ?? null
  );
  const [firstLoadContent, setFirstLoadContent] =
    useState<InstructionFormat | null>(instructions);

  return (
    <div className="w-full grid gap-4">
      <div className="flex justify-between w-full">
        <div className="grid items-center gap-4">
          <div className="text-xl mb-2">Instructions</div>
        </div>
      </div>{" "}
      <ViewOnlyQuill initialContent={firstLoadContent} />
      {/* {editMode ? (
        <Editor
          initialContent={firstLoadContent}
          onChangeHandler={setInstructions}
        />
      ) : (
        <ViewOnlyQuill initialContent={firstLoadContent} />
      )} */}
    </div>
  );
};

export default DrinkInstructions;
