"use server";

import {
  IngredientsSchema,
  MutableIngredientFields,
  CreateIngredientFields,
} from "@/app/ingredients/models";
import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
import { calculateRange } from "@/utils/supabase/pagination";

/** Create */
const createIngredient = async (formData: CreateIngredientFields) => {
  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg.from("ingredients").insert([formData]).select();
  if (error) throw new Error(error.message || "Error creating ingredient");
  return data as IngredientsSchema[];
};

/** List paginated. Pass `includeCount` to also fetch the total row count. */
const queryIngredients = async (
  page: number,
  limit: number,
  includeCount: boolean = false
): Promise<{ data: IngredientsSchema[]; totalCount: number | null }> => {
  const pg = await createSupabaseServerActionClient();
  const { from, to } = calculateRange(page, limit);

  const { data, count, error } = await pg
    .from("ingredients")
    .select("*", includeCount ? { count: "exact" } : undefined)
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error querying ingredients:", error);
    throw new Error(`Error querying ingredients: ${error.message}`);
  }

  return {
    data: (data ?? []) as IngredientsSchema[],
    totalCount: includeCount ? (count ?? 0) : null,
  };
};

/** List all (id + name) */
const queryAllIngredients = async (): Promise<IngredientsSchema[]> => {
  const pg = await createSupabaseServerActionClient();
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
  const pg = await createSupabaseServerActionClient();
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
  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg.from("ingredients").update(fields).eq("id", id).select();
  if (error) throw new Error(error.message || "Error updating ingredient");
  return data as IngredientsSchema[];
};

/** Delete */
const deleteIngredient = async (id: string) => {
  const pg = await createSupabaseServerActionClient();
  const { data, error } = await pg.from("ingredients").delete().eq("id", id).select();
  if (error) throw new Error(error.message || "Error deleting ingredient");
  return data as IngredientsSchema[];
};

export {
  createIngredient,
  queryIngredients,
  queryAllIngredients,
  searchForIngredient,
  updateIngredient,
  deleteIngredient,
};
