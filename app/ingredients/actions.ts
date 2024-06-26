"use server";
import { Ingredients } from "@/app/ingredients/models";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

const pg = createSupabaseServerClient();

const createIngredient = async (formData: Ingredients) => {
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

const queryAllIngredients = async (): Promise<Ingredients[]> => {
  const { data, error } = await pg
    .from("ingredients")
    .select("*")
    .order("name", { ascending: true })
    .limit(20);

  if (error) {
    console.error("Error checking existence:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  } else {
    return data;
  }
};

const searchForIngredient = async (term: string): Promise<Ingredients[]> => {
  const { data, error } = await pg
    .from("ingredients")
    .select("*")
    .ilike("name", term);

  if (error) {
    console.error("Error checking existence:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  } else {
    return data;
  }
};

export { createIngredient, queryAllIngredients, searchForIngredient };
