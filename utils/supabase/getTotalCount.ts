"use server";
import { createSupabaseServerActionClient } from "./server-client";

export const getTotalCount = async (table: string): Promise<number> => {
  const pg = await createSupabaseServerActionClient(); // <-- await the client

  const { count, error } = await pg
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error(`Error fetching total count: ${error.message}`);
  }
  return count ?? 0;
};
