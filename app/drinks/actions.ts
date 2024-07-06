"use server";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import { DrinkSchema, CreateDrinkFields, MutableDrinkFields } from "./models";
import { getUserSession } from "@/context/Authenticated";
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
  const authenticated = await getUserSession();
  if (authenticated) {
    const existingDrinks = await getExistingDrinksWithName(formData.name);
    const friendlyNumber = getNextFriendlyNumber(existingDrinks, formData.name);
    const newUniqueName =
      friendlyNumber === 1
        ? sanitizeInput(formData.name)
        : `${sanitizeInput(formData.name)}_${friendlyNumber}`;
    const postDrink = {
      ...formData,
      created_by: authenticated.id,
      unique_name : newUniqueName,
    };
    

    try {
      const { data, error } = await pg.from("drinks").insert(postDrink);
      if (error) {
        throw new Error(error.message || "Drink could not be created");
      }
      return data;
    } catch (error) {
      console.error("Drink could not be created", error);
      throw error;
    }
  } else {
    throw new Error("User not authenticated");
  }
};

const deleteDrink = async (id: string) => {
  console.log("Deleting drink with id", id);
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
      console.error("Error updating drink", error);
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
  data: (DrinkSchema & { username: string })[];
  totalCount: number;
}> => {
  // Calculate the range for pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Construct the query for getting drinks with profiles
  let query = pg
    .from('drinks')
    .select(`
      *,
      profiles ( username )
    `)
    .order('name', { ascending: true })
    .range(from, to);

  // Add filters to the query
  if (searchName) {
    query = query.ilike('name', `%${searchName}%`);
  }

  if (drinkType && drinkType !== 'all') {
    query = query.eq('drink_type', drinkType);
  }

  // Execute the query
  const { data, error, count } = await query;

  if (error) {
    console.error('Error querying drinks:', error);
    throw new Error(`Error querying drinks: ${error.message}`);
  }

  // Transform the data to include the username
  const drinksWithUsername = data.map((drink: any) => ({
    ...drink,
    username: drink.profiles?.username || 'Unknown',
  }));

  const totalCount = count ?? 0;

  return {
    data: drinksWithUsername,
    totalCount,
  };
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

export {
  createDrink,
  deleteDrink,
  updateDrinkBasics,
  queryDrinks,
  getDrinkByID,
};
