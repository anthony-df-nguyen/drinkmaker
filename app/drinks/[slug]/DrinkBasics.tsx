"use client";
import React, { useState, useEffect, useCallback } from "react";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";
import { DrinkSchema, drinkTypeColors, drinkTypes } from "../models";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { sanitizeInput } from "@/utils/sanitizeInput";
import Badge from "@/components/UI/Badge";
import Card from "@/components/UI/Card";
import Button from "@/components/UI/Button";
import { updateDrinkBasics } from "../actions";
import { enqueueSnackbar } from "notistack";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
}

const DrinkBasics: React.FC<ViewOnlyModeProps> = ({ drink }) => {
  const { description } = drink;
  const [form, setForm] = useState({ ...drink });
  const [editMode, setEditMode] = useState(false);
  const [hover, setHover] = useState<boolean>(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "name") {
      setForm({
        ...form,
        name: value as string,
        unique_name: sanitizeInput(value as string),
      });
    } else {
      setForm({ ...form, [field]: value as string });
    }
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateDrinkBasics(drink.id, form).then(() => {
        // Close the edit form after updating the drink
        setEditMode(false);
        enqueueSnackbar("Successfully updated drink", { variant: "success" });
      });
    } catch (error) {
      console.error("Error updating drink: ", error);
      enqueueSnackbar("Error updating drink", { variant: "error" });
    }
  };

  const readView = () => {
    return (
      <div className="flex justify-between w-full">
      <div className="grid items-center gap-2">
        <div className="pageTitle mb-2">{drink.name}</div>
        <div>{description}</div>
        <div>
          <Badge
            label={drink.drink_type}
            color={drinkTypeColors[drink.drink_type]}
          />
        </div>
      </div>
      
      {hover && <div
        className="w-8 h-8 cursor-pointer"
        onClick={() => setEditMode(true)}
      >
        <PencilSquareIcon />
      </div>}
    </div>
    );
  };

  const editView = () => {
    return (
      <form onSubmit={submitForm} className="w-full ">
      <div className="grid gap-8">
        <DebouncedTextInput
          label="Name"
          value={drink.name}
          onChange={(value: string) => handleChange("name", value || "")}
          required
          variant="outlined"
        />
        <DebouncedTextInput
          label="Description"
          value={drink.description}
           variant="outlined"
          onChange={(value: string) =>
            handleChange("description", value || "")
          }
          multiline
          minRows={3}
        />
        <CustomSelect
          label="Drink Type"
          variant="outlined"
          required
          options={drinkTypes.filter((row) => row.value !== "all")}
          value={form.drink_type}
          onChange={(value: string) => handleChange("drink_type", value)}
        />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button
          label="Cancel"
          disabled={false}
          onClick={() => setEditMode(false)}
          type="button"
          variant="cancel"
        />
        <Button
          label="Submit"
          disabled={false}
          type="submit"
          variant="primary"
        />
      </div>
    </form>
    );
  };

  return (
    <div className="max-w-[1200px] w-full block mx-auto" onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {editMode ? editView() : readView()}
    </div>
  );
};

export default DrinkBasics;
