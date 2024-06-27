"use server";
import { createSupabaseServerClient } from "./server-client";

/**
 * Retrieves the total count of records in a given table.
 * 
 * @param table - The name of the table to retrieve the count from.
 * @returns A promise that resolves to the total count of records in the table.
 * @throws An error if there was an issue fetching the total count.
 */
export const getTotalCount = async (table: string): Promise<number> => {
  const pg = createSupabaseServerClient();
  const { count, error } = await pg
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error("Error fetching total count");
  }

  return count || 0;
};
