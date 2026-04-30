"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { updateDrinkBasics } from "../../actions";
import { upsertDrinkIngredients } from "../drink_ingredients/actions";
import { upsertDrinkInstruction } from "../instructions/actions";
import { MutableDrinkFields } from "../../models";
import type { GlobalDrinkForm } from "../formTypes";

interface UseDrinkFormSaveResult {
  saving: boolean;
  save: (form: GlobalDrinkForm) => Promise<void>;
}

export function useDrinkFormSave(): UseDrinkFormSaveResult {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (form: GlobalDrinkForm) => {
      setSaving(true);
      try {
        const basics: MutableDrinkFields = {
          name: form.name,
          description: form.description,
          drink_type: form.drink_type,
          is_alcoholic: form.is_alcoholic,
          picture: form.picture,
        };
        await updateDrinkBasics(form.id, basics);
        await upsertDrinkIngredients({
          drink_id: form.id,
          ingredient_details: form.ingredients,
        });
        await upsertDrinkInstruction(form.id, form.instructions);

        enqueueSnackbar("Drink successfully updated", { variant: "success" });
        setTimeout(() => {
          router.push(`/drinks/${form.unique_name}`);
        }, 1000);
      } catch (error) {
        console.error("Failed to update the database: ", error);
        enqueueSnackbar("There was an error updating the drink", {
          variant: "error",
        });
      } finally {
        setSaving(false);
      }
    },
    [router],
  );

  return { saving, save };
}
