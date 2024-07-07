"use client";
import React, { useState } from "react";
import DebouncedTextInput from "@/components/MUIInputs/TextInput";
import Button from "@/components/UI/Button";
import Select from "@/components/MUIInputs/Select";
import { useAuthenticatedContext } from "@/context/Authenticated";
import { enqueueSnackbar } from "notistack";
import { CreateDrinkFields, drinkTypes } from "../models";
import { createDrink } from "../actions";
import { useModal } from "@/context/ModalContext";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { useRouter } from "next/navigation";
import Error from "next/error";

/**
 * Component for creating a new drink.
 */
const CreateForm = () => {
  const { user } = useAuthenticatedContext();
  const { hideModal } = useModal();
  const router = useRouter();

  const [form, setForm] = useState<CreateDrinkFields>({
    name: "",
    unique_name: "",
    description: "",
    created_by: "",
    drink_type: "cocktail",
  });

  const [formErrors, setFormErrors] = useState({});

  /**
   * Handles the change event for the form fields.
   * @param field - The field to update.
   * @param value - The new value for the field.
   */
  const handleChange = (field: keyof typeof form, value: string) => {
    if (field === "name") {
      setForm((prev) => ({
        ...prev,
        name: value,
        unique_name: sanitizeInput(value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Handles the form submission event.
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDrink({ ...form });
      hideModal();
      router.push(`/drinks/${form.unique_name}`);
    } catch (error: Error | any) {
      console.error(error.message);
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  const maxNameLength = 50;
  const maxDescriptionLength = 250;

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 max-w-[300px] md:max-w-lg w-screen"
    >
      <div className="text-lg font-medium">Create Drink</div>
      <div className="grid gap-4">
        <DebouncedTextInput
          label="Name"
          value={form.name}
          onChange={(value: string) => handleChange("name", value)}
          delay={50}
          error={form.name.length > maxNameLength}
          errorText="Too many characters"
          required
          variant="outlined"
          size="small"
        />
        <Select
          label="Drink Type"
          required
          options={drinkTypes.filter((row) => row.value !== "all")}
          value={form.drink_type}
          onChange={(value: string) => handleChange("drink_type", value)}
          size="small"
        />
        <DebouncedTextInput
          label="Description"
          value={form.description}
          onChange={(value: string) => handleChange("description", value)}
          error={form.description.length > maxDescriptionLength}
          errorText="Too many characters"
          multiline
          delay={50}
          minRows={3}
          variant="outlined"
          size="small"
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          label="Create"
          type="submit"
          variant="primary"
          disabled={form.name.length > maxNameLength || form.description.length > maxDescriptionLength}
        />
      </div>
    </form>
  );
};

export default CreateForm;
