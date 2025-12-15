"use server";

import {
  IngredientsSchema,
  MutableIngredientFields,
  CreateIngredientFields,
} from "@/app/ingredients/models";
import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";

// optional helper (must be called inside actions)
async function getPg() {
  return await createSupabaseServerActionClient();
}

/** Create */
const createIngredient = async (formData: CreateIngredientFields) => {
  const pg = await getPg();
  try {
    const { data, error } = await pg.from("ingredients").insert([formData]).select();
    if (error) throw new Error(error.message || "Error creating ingredient");
    return data as IngredientsSchema[];
  } catch (error) {
    console.error("Ingredient could not be created", error);
    throw error;
  }
};

/** List paginated */
const queryIngredients = async (
  page: number,
  limit: number
): Promise<IngredientsSchema[]> => {
  const pg = await getPg();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await pg
    .from("ingredients")
    .select("*")
    .order("name", { ascending: true })
    .range(from, to); // .limit(limit) not needed when using .range

  if (error) {
    console.error("Error querying ingredients:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  }
  return (data ?? []) as IngredientsSchema[];
};

/** List paginated (data + total count) */
const queryIngredientsWithCount = async (
  page: number,
  limit: number
): Promise<{ data: IngredientsSchema[]; totalCount: number }> => {
  const pg = await getPg();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await pg
    .from("ingredients")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error querying ingredients:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  }

  return {
    data: (data ?? []) as IngredientsSchema[],
    totalCount: count ?? 0,
  };
};

/** List all (id + name) */
const queryAllIngredients = async (): Promise<IngredientsSchema[]> => {
  const pg = await getPg();
  const { data, error } = await pg
    .from("ingredients")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error querying ingredients:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  }
  return (data ?? []) as IngredientsSchema[];
};

/** Search by term */
const searchForIngredient = async (term: string): Promise<IngredientsSchema[]> => {
  const pg = await getPg();
  const { data, error } = await pg
    .from("ingredients")
    .select("*")
    .ilike("name", `%${term}%`);

  if (error) {
    console.error("Error searching ingredients:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  }
  return (data ?? []) as IngredientsSchema[];
};

/** Update */
const updateIngredient = async (id: string, fields: MutableIngredientFields) => {
  const pg = await getPg();
  try {
    const { data, error } = await pg.from("ingredients").update(fields).eq("id", id).select();
    if (error) throw new Error(error.message || "Error updating ingredient");
    return data as IngredientsSchema[];
  } catch (error) {
    console.error("Ingredient could not be updated", error);
    throw error;
  }
};

/** Delete */
const deleteIngredient = async (id: string) => {
  const pg = await getPg();
  try {
    const { data, error } = await pg.from("ingredients").delete().eq("id", id).select();
    if (error) throw new Error(error.message || "Error deleting ingredient");
    return data as IngredientsSchema[];
  } catch (error) {
    console.error("Ingredient could not be deleted", error);
    throw error;
  }
};

export {
  createIngredient,
  queryIngredients,
  queryIngredientsWithCount,
  queryAllIngredients,
  searchForIngredient,
  updateIngredient,
  deleteIngredient,
};
