"use server";
import { createSupabaseServerClient } from "./server-client";

const pg = createSupabaseServerClient();
/**
 * Checks if a value exists in a specific column of a table in the Supabase database.
 * @param table - The name of the table to check.
 * @param column - The name of the column to check.
 * @param value - The value to check for existence in the specified column.
 * @returns A Promise that resolves to a boolean indicating whether the value exists in the column.
 * @throws If there is an error checking the existence or if the value is not a string.
 */
const checkExisting = async (
  table: string,
  column: string,
  value: string
): Promise<boolean> => {
  try {
    const { data, error } = await pg
      .from(table)
      .select(column)
      .eq(column, value);
    if (error) {
      throw new Error(error.message || "Error checking existence");
    }
    return data.length > 0 ? true : false;
  } catch (error) {
    console.error("Error checking existence:", error);
    throw new Error(`Error checking existence`);
  }
};

export default checkExisting;
