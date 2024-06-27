"use server";
import { IngredientsSchema, MutableIngredientFields, CreateIngredientFields } from "@/app/ingredients/models";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

const pg = createSupabaseServerClient();

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

const queryAllIngredients = async (): Promise<IngredientsSchema[]> => {
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

const searchForIngredient = async (term: string): Promise<IngredientsSchema[]> => {
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

export { createIngredient, queryAllIngredients, searchForIngredient, updateIngredient, deleteIngredient };
