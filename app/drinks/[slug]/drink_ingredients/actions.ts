"use server";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import { InsertDrinkIngredients, DrinkIngredientSchema } from "./models";
import { sanitizeInput } from "@/utils/sanitizeInput";

const pg = createSupabaseServerComponentClient();

const upsertDrinkIngredients = async (
  drinkDetails: InsertDrinkIngredients
): Promise<void> => {
  const { drink_id, ingredient_details } = drinkDetails;

  // Fetch current ingredient IDs for the specified drink
  const { data: currentIngredients, error: fetchError } = await pg
    .from("drink_ingredients")
    .select("ingredient_id, quantity, unit")
    .eq("drink_id", drink_id);

  if (fetchError) {
    throw new Error(`Error fetching current ingredients: ${fetchError.message}`);
  }

  const currentIngredientMap = new Map(currentIngredients.map((row) => [row.ingredient_id, row]));
  const newIngredientMap = new Map(ingredient_details.map((detail) => [detail.ingredient_id, detail]));

  // Determine ingredients to delete
  const ingredientIdsToDelete = Array.from(currentIngredientMap.keys()).filter(
    (id) => !newIngredientMap.has(id)
  );

  // Determine ingredients to update or insert
  const ingredientsToUpsert = Array.from(newIngredientMap.values()).map((detail) => ({
    drink_id,
    ingredient_id: detail.ingredient_id,
    quantity: detail.quantity,
    unit: detail.unit,
  }));

  // Delete ingredients that are not in the new list
  if (ingredientIdsToDelete.length > 0) {
    const { error: deleteError } = await pg
      .from("drink_ingredients")
      .delete()
      .eq("drink_id", drink_id)
      .in("ingredient_id", ingredientIdsToDelete);

    if (deleteError) {
      throw new Error(`Error deleting old ingredients: ${deleteError.message}`);
    }
  }

  // Upsert new and updated ingredients
  if (ingredientsToUpsert.length > 0) {
    const { error: upsertError } = await pg
      .from("drink_ingredients")
      .upsert(ingredientsToUpsert, { onConflict: "drink_id, ingredient_id" });

    if (upsertError) {
      throw new Error(`Error upserting ingredients: ${upsertError.message}`);
    }
  }
};


const getDrinkIngredients = async (
  drink_id: string
): Promise<DrinkIngredientSchema[] | null> => {
  const { data, error } = await pg
    .from("drink_ingredients")
    .select("*")
    .eq("drink_id", drink_id);

  if (error) {
    throw new Error(`Error getting data: ${error.message}`);
  }

  return data.length > 0 ? data : null;
};

export { upsertDrinkIngredients, getDrinkIngredients };
