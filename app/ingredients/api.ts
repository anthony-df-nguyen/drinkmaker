// utilities/supabase/checkExisting.ts

import { SupabaseClient } from "@supabase/supabase-js";
import { Ingredients } from "@/schema/ingredients";

const queryAllIngredients = async (
  pg: SupabaseClient,
  handler: React.Dispatch<React.SetStateAction<Ingredients[]>>
) => {
  const { data, error } = await pg
    .from("ingredients")
    .select("name")
    .order("name", { ascending: true })
    .limit(20);

  if (error) {
    console.error("Error checking existence:", error);
    return false; // or handle error appropriately
  } else {
    return handler(data);
  }
};

const queryByIngredient = async (
  pg: SupabaseClient,
  term: string,
  handler: React.Dispatch<React.SetStateAction<Ingredients[]>>
) => {
  const { data, error } = await pg
    .from("ingredients")
    .select("name")
    .ilike("name", term);

  if (error) {
    console.error("Error checking existence:", error);
    return false; // or handle error appropriately
  } else {
    return handler(data);
  }
};

export { queryAllIngredients, queryByIngredient };
