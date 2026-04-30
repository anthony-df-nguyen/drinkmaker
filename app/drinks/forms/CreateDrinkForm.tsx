"use client";
import React, { useState } from "react";
import TextInput from "@/components/UI/input";
import TextArea from "@/components/UI/textarea";
import { Button } from "@/components/UI/Button";
import Select from "@/components/UI/select";
import { enqueueSnackbar } from "notistack";
import {
  CreateDrinkFields,
  drinkTypeFormOptions,
  alcoholicOptions,
  decodeAlcoholic,
  encodeAlcoholic,
} from "../models";
import { createDrink } from "../actions";
import { useModal } from "@/context/ModalContext";
import { sanitizeInput } from "@/utils/sanitizeInput";
import { useRouter } from "next/navigation";
import Error from "next/error";

/**
 * Component for creating a new drink.
 */
const CreateForm = () => {
  const { hideModal } = useModal();
  const router = useRouter();

  const [form, setForm] = useState<CreateDrinkFields>({
    name: "",
    unique_name: "",
    description: "",
    created_by: "",
    drink_type: "cocktail",
    is_alcoholic: true,
  });

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
      router.push(`/drinks/${form.unique_name}?edit=true`);
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
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="font-serif font-bold text-xl">New Drink</div>
      <div className="grid gap-4">
        <TextInput
          label="Name"
          value={form.name}
          onChange={(value: string) => handleChange("name", value)}
          delay={50}
          error={form.name.length > maxNameLength}
          errorText="Too many characters"
          required
        />
        <Select
          label="Drink Type"
          required
          options={drinkTypeFormOptions}
          value={form.drink_type}
          onChange={(value: string) => handleChange("drink_type", value)}
        />
        <Select
          label="Alcoholic?"
          options={alcoholicOptions}
          value={encodeAlcoholic(form.is_alcoholic)}
          onChange={(value: string) =>
            setForm((prev) => ({ ...prev, is_alcoholic: decodeAlcoholic(value as "true" | "false") }))
          }
        />
        <TextArea
          label="Description"
          value={form.description}
          onChange={(value: string) => handleChange("description", value)}
          error={form.description.length > maxDescriptionLength}
          errorText="Too many characters"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          variant="default"
          disabled={
            form.name.length > maxNameLength ||
            form.description.length > maxDescriptionLength
          }
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default CreateForm;
