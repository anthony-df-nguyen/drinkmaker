"use server";
import { IngredientsSchema, MutableIngredientFields, CreateIngredientFields } from "@/app/ingredients/models";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

const pg = createSupabaseServerClient();

/**
 * Creates a new ingredient in the database.
 *
 * @param formData - The data for the new ingredient.
 * @returns A promise that resolves to the created ingredient data.
 * @throws If there is an error creating the ingredient.
 */
const createIngredient = async (formData: CreateIngredientFields) => {
  try {
    const { data, error } = await pg.from("ingredients").insert([formData]);
    if (error) {
      throw new Error(error.message || "Error creating ingredient");
    }
    return data;
  } catch (error) {
    console.error("Ingredient could not be created", error);
    throw error;
  }
};

/**
 * Retrieves a paginated list of ingredients from the database.
 *
 * @param page - The page number of the results to retrieve.
 * @param limit - The maximum number of results per page.
 * @returns A promise that resolves to an array of IngredientsSchema objects.
 * @throws If there is an error querying the ingredients.
 */
const queryIngredients = async (page: number, limit: number): Promise<IngredientsSchema[]> => {
  console.debug("Querying ingredients");
  const { data, error } = await pg
    .from("ingredients")
    .select("*")
    .order("name", { ascending: true })
    .range((page - 1) * limit, page * limit - 1)
    .limit(limit);

  if (error) {
    console.error("Error checking existence:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  } else {
    return data;
  }
};

const queryAllIngredients = async (): Promise<IngredientsSchema[]> => {
  const { data, error } = await pg
    .from("ingredients")
    .select("id, name")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error checking existence:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  } else {
    return data;
  }
};

/**
 * Searches for ingredients in the database based on a search term.
 *
 * @param term - The search term to match against ingredient names.
 * @returns A promise that resolves to an array of IngredientsSchema objects matching the search term.
 * @throws If there is an error querying the ingredients.
 */
const searchForIngredient = async (term: string): Promise<IngredientsSchema[]> => {
  console.log(term)
  const { data, error } = await pg
    .from("ingredients")
    .select("*")
    .ilike("name", `%${term}%`);

  if (error) {
    console.error("Error checking existence:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  } else {
    return data;
  }
};

/**
 * Updates an existing ingredient in the database.
 *
 * @param id - The ID of the ingredient to update.
 * @param fields - The fields to update in the ingredient.
 * @returns A promise that resolves to the updated ingredient data.
 * @throws If there is an error updating the ingredient.
 */
const updateIngredient = async (id: string, fields: MutableIngredientFields) => {
  try {
    const { data, error } = await pg
      .from("ingredients")
      .update(fields)
      .match({ id: id });

    if (error) {
      throw new Error(error.message || "Error updating ingredient");
    }
    return data;
  } catch (error) {
    console.error("Ingredient could not be updated", error);
    throw error;
  }
}

/**
 * Deletes an ingredient from the database.
 *
 * @param id - The ID of the ingredient to delete.
 * @returns A promise that resolves to the deleted ingredient data.
 * @throws If there is an error deleting the ingredient.
 */
const deleteIngredient = async (id: string) => {  
  try {
    const { data, error } = await pg.from("ingredients").delete().match({ id: id });
    if (error) {
      throw new Error(error.message || "Error deleting ingredient");
    }
    return data;
  } catch (error) {
    console.error("Ingredient could not be deleted", error);
    throw error;
  }
}

export { createIngredient, queryIngredients, queryAllIngredients, searchForIngredient, updateIngredient, deleteIngredient };
