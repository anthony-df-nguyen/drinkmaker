"use client";
import { useEffect, useState } from "react";
import { getDrinkByID } from "../../actions";
import { getDrinkIngredients } from "../drink_ingredients/actions";
import { getDrinkInstructionByID } from "../instructions/actions";
import type { GlobalDrinkForm } from "../formTypes";

export const EMPTY_DRINK_FORM: GlobalDrinkForm = {
  name: "",
  unique_name: "",
  drink_type: "",
  is_alcoholic: true,
  id: "",
  description: "",
  ingredients: [],
  instructions: null,
  created_by_user_id: "",
  created_by_user: "",
  picture: null,
};

interface UseDrinkFormDataResult {
  form: GlobalDrinkForm;
  setForm: React.Dispatch<React.SetStateAction<GlobalDrinkForm>>;
  loading: boolean;
  error: string | null;
}

/**
 * Loads basic drink data, its ingredients, and its instructions for a given
 * slug, then exposes the merged form along with React setters for downstream
 * editing.
 */
export function useDrinkFormData(slug: string): UseDrinkFormDataResult {
  const [form, setForm] = useState<GlobalDrinkForm>(EMPTY_DRINK_FORM);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const basic = await getDrinkByID(slug);
        const [ingredients, instructions] = await Promise.all([
          getDrinkIngredients(basic.id),
          getDrinkInstructionByID(basic.id),
        ]);

        if (cancelled) return;

        setForm({
          id: basic.id,
          name: basic.name,
          unique_name: basic.unique_name,
          description: basic.description,
          ingredients: ingredients ?? [],
          instructions: instructions?.instructions ?? null,
          drink_type: basic.drink_type,
          is_alcoholic: basic.is_alcoholic,
          created_by_user_id: basic.created_by,
          created_by_user: basic.profiles?.username ?? "Unknown",
          picture: basic.picture,
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load drink";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { form, setForm, loading, error };
}
