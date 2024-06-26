"use server";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import type { CreateDrinkFields } from "./models";

const pg = createSupabaseServerComponentClient();

/**
 * Creates a new drink.
 *
 * @param formData - The data for the new drink.
 * @returns A Promise that resolves to the created drink data.
 * @throws If there is an error creating the drink.
 */
const createDrink = async (formData: CreateDrinkFields) => {
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

export { createDrink };
