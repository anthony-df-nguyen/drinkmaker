"use server";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import { DrinkSchema, CreateDrinkFields, MutableDrinkFields } from "./models";
import { InstructionFormat } from "./[slug]/instructions/models";
import { sanitizeInput } from "@/utils/sanitizeInput";

const pg = createSupabaseServerComponentClient();

const getExistingDrinksWithName = async (name: string) => {
  const sanitizedName = sanitizeInput(name);
  const { data, error } = await pg
    .from("drinks")
    .select("unique_name")
    .ilike("unique_name", `${sanitizedName}%`);

  if (error) {
    throw new Error("Error fetching drinks with the same name");
  }

  return data;
};

const getNextFriendlyNumber = (
  existingDrinks: { unique_name: string }[],
  name: string
): number => {
  const sanitizedName = sanitizeInput(name);
  const numbers = existingDrinks
    .map((drink) => {
      const match = drink.unique_name.match(
        new RegExp(`${sanitizedName}(_(\\d+))?$`)
      );
      return match ? (match[2] ? parseInt(match[2], 10) : 1) : 0;
    })
    .filter((number) => !isNaN(number))
    .sort((a, b) => a - b);

  for (let i = 1; i <= numbers.length; i++) {
    if (i !== numbers[i - 1]) {
      return i;
    }
  }

  return numbers.length + 1;
};

const createDrink = async (formData: CreateDrinkFields) => {
  const existingDrinks = await getExistingDrinksWithName(formData.name);
  const friendlyNumber = getNextFriendlyNumber(existingDrinks, formData.name);
  const newUniqueName =
    friendlyNumber === 1
      ? sanitizeInput(formData.name)
      : `${sanitizeInput(formData.name)}_${friendlyNumber}`;
  formData.unique_name = newUniqueName;

  try {
    const { data, error } = await pg.from("drinks").insert([formData]);
    if (error) {
      throw new Error(error.message || "Error creating drink");
    }

    return data;
  } catch (error) {
    console.error("Drink could not be created", error);
    throw error;
  }
};

const deleteDrink = async (id: string) => {
  try {
    const { data, error } = await pg.from("drinks").delete().match({ id: id });
    if (error) {
      throw new Error(error.message || "Error deleting drink");
    }
    return data;
  } catch (error) {
    console.error("Drink could not be deleted", error);
    throw error;
  }
};

const updateDrinkBasics = async (id: string, fields: MutableDrinkFields) => {
  try {
    const { data, error } = await pg
      .schema("public")
      .from("drinks")
      .update(fields)
      .match({ id: id });

    if (error) {
      throw new Error(error.message || "Error updating drink");
    }
    return data;
  } catch (error) {
    console.error("Drink could not be updated", error);
    throw error;
  }
};

const queryDrinks = async (
  page: number,
  limit: number,
  searchName?: string,
  drinkType?: string
): Promise<{
  data: DrinkSchema[];
  totalCount: number;
}> => {
  // Count query to get total number of drinks matching the criteria
  let countQuery = pg
    .schema("public")
    .from("drinks")
    .select("*", { count: "exact", head: true });

  if (searchName) {
    countQuery = countQuery.ilike("name", `%${searchName}%`);
  }

  if (drinkType && drinkType !== "all") {
    countQuery = countQuery.eq("drink_type", drinkType);
  }

  const countResult = await countQuery;

  if (countResult.error) {
    console.error("Error getting total count:", countResult.error);
    throw new Error(`Error getting total count: ${countResult.error.message}`);
  }
  const totalCount = countResult.count ?? 0;

  // Main query to fetch drinks with pagination
  let query = pg
    .from("drinks")
    .select("*")
    .order("name", { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  if (searchName) {
    query = query.ilike("name", `%${searchName}%`);
  }

  if (drinkType && drinkType !== "all") {
    query = query.eq("drink_type", drinkType);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error querying drinks:", error);
    throw new Error(`Error querying drinks: ${error.message}`);
  } else {
    return {
      data,
      totalCount,
    };
  }
};

const getDrinkByID = async (slug: string): Promise<DrinkSchema> => {
  const { data, error } = await pg
    .from("drinks")
    .select("*")
    .eq("unique_name", slug)
    .single();

  if (error) {
    console.error(`Error querying for unique_name ${slug}`, error);
    throw new Error(`Error querying for unique_name: ${error.message}`);
  } else {
    return data;
  }
};

export { createDrink, deleteDrink, updateDrinkBasics, queryDrinks, getDrinkByID };
