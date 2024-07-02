"use client";
import React, { useState, useEffect, useCallback } from "react";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import CustomSelect from "@/components/MUIInputs/Select";
import { DrinkSchema, drinkTypeColors, drinkTypes } from "../models";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { sanitizeInput } from "@/utils/sanitizeInput";
import Badge from "@/components/UI/Badge";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button";
import { updateDrinkBasics, deleteDrink } from "../actions";
import { enqueueSnackbar } from "notistack";

interface ViewOnlyModeProps {
  drink: DrinkSchema;
}

const DrinkBasics: React.FC<ViewOnlyModeProps> = ({ drink }) => {
  const { description } = drink;
  const [form, setForm] = useState({ ...drink });
  const [editMode, setEditMode] = useState(false);
  const [hover, setHover] = useState<boolean>(true);

  const router = useRouter();

  const handleChange = useCallback(
    (field: keyof typeof form, value: string) => {
      setForm((prevForm) => {
        if (field === "name") {
          return {
            ...prevForm,
            name: value,
            unique_name: sanitizeInput(value),
          };
        } else {
          return { ...prevForm, [field]: value };
        }
      });
    },
    []
  );

  const handleDelete = async () => {
    try {
      deleteDrink(drink.id).then(() => {
        enqueueSnackbar("Successfully deleted drink", {
          variant: "success",
        });
        setTimeout(() => {
          router.push("/");
        }, 2500);
      });
    } catch (error) {
      console.error("Error deleting drink: ", error);
      enqueueSnackbar("Error deleting drink", { variant: "error" });
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

  const readView = () => (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="pageTitle">{drink.name}</div>
        {/* Buttons */}
        {hover && (
          <div className="flex items-center gap-2">
            {" "}
            <div
              className="w-8 h-8 cursor-pointer"
              onClick={() => handleDelete()}
            >
              <TrashIcon color="gray" />
            </div>
            <div
              className="w-8 h-8 cursor-pointer"
              onClick={() => setEditMode(true)}
            >
              <PencilSquareIcon color="gray" />
            </div>
          </div>
        )}
      </div>
      <div className="text-sm">{description}</div>
      <Badge
        label={drink.drink_type}
        color={drinkTypeColors[drink.drink_type]}
      />
    </div>
  );

  const editView = () => (
    <form onSubmit={submitForm} className="w-full">
      <div className="grid gap-8">
        <DebouncedTextInput
          label="Name"
          value={form.name}
          onChange={(value: string) => handleChange("name", value || "")}
          required
          variant="outlined"
          delay={500}
        />
        <DebouncedTextInput
          label="Description"
          value={form.description}
          variant="outlined"
          delay={500}
          onChange={(value: string) => handleChange("description", value || "")}
          multiline
          minRows={3}
        />
        <CustomSelect
          label="Drink Type"
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

  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {editMode ? editView() : readView()}
    </div>
  );
};

export default DrinkBasics;
