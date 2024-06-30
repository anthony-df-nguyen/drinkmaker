"use server";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import { sanitizeInput } from "@/utils/sanitizeInput";

const pg = createSupabaseServerComponentClient();

const upsertDrinkIngredient = async (
  drink_id: string,
  ingredients: string[]
): Promise<void> => {
  const { data, error } = await pg.rpc("upsert_drink_ingredients", {
    drink_id: drink_id,
    ingredient_ids: ingredients,
  });

  if (error) {
    throw new Error(`Error upserting drink ingredients: ${error.message}`);
  }
};

export { upsertDrinkIngredient };
