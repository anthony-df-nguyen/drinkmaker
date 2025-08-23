"use server";

import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
import { InsertDrinkIngredients, DrinkIngredientSchema } from "./models";

/** Upsert ingredients for a drink (add/update + remove missing ones). */
const upsertDrinkIngredients = async (
  drinkDetails: InsertDrinkIngredients
): Promise<void> => {
  const pg = await createSupabaseServerActionClient(); // ✅ create inside action
  const { drink_id, ingredient_details } = drinkDetails;

  // 1) Fetch current ingredient rows for this drink
  const { data: currentIngredients = [], error: fetchError } = await pg
    .from("drink_ingredients")
    .select("ingredient_id, quantity, unit")
    .eq("drink_id", drink_id);

  if (fetchError) {
    throw new Error(`Error fetching current ingredients: ${fetchError.message}`);
  }

  const currentMap = new Map(
    currentIngredients?.map((row) => [row.ingredient_id, row])
  );
  const nextMap = new Map(
    ingredient_details.map((d) => [d.ingredient_id, d])
  );

  // 2) Determine rows to delete (present before, missing now)
  const ingredientIdsToDelete = Array.from(currentMap.keys()).filter(
    (id) => !nextMap.has(id)
  );

  if (ingredientIdsToDelete.length > 0) {
    const { error: delErr } = await pg
      .from("drink_ingredients")
      .delete()
      .eq("drink_id", drink_id)
      .in("ingredient_id", ingredientIdsToDelete);
    if (delErr) {
      throw new Error(`Error deleting old ingredients: ${delErr.message}`);
    }
  }

  // 3) Upsert all provided rows (covers insert + update)
  const upsertRows = ingredient_details.map((d) => ({
    drink_id,
    ingredient_id: d.ingredient_id,
    quantity: d.quantity,
    unit: d.unit,
  }));

  if (upsertRows.length > 0) {
    const { error: upsertErr } = await pg
      .from("drink_ingredients")
      .upsert(upsertRows, { onConflict: "drink_id, ingredient_id" }); // composite key
    if (upsertErr) {
      throw new Error(`Error upserting ingredients: ${upsertErr.message}`);
    }
  }
};

/** Get all ingredient rows for a drink. */
const getDrinkIngredients = async (
  drink_id: string
): Promise<DrinkIngredientSchema[] | null> => {
  const pg = await createSupabaseServerActionClient(); // ✅ create inside action
  const { data, error } = await pg
    .from("drink_ingredients")
    .select("*")
    .eq("drink_id", drink_id)
    .order("ingredient_id", { ascending: true });

  if (error) {
    throw new Error(`Error getting data: ${error.message}`);
  }
  return (data && data.length > 0) ? (data as DrinkIngredientSchema[]) : null;
};

export { upsertDrinkIngredients, getDrinkIngredients };
