// utilities/supabase/checkExisting.ts

import { SupabaseClient } from "@supabase/supabase-js";
import { enqueueSnackbar } from "notistack";

/**
 * Checks if a row with the given value exists in the specified table.
 * @param pg - Supabase client instance.
 * @param table - The table to check.
 * @param column - The column to search.
 * @param value - The value to search for.
 * @returns A boolean indicating if the row exists.
 */
const checkExisting = async (
  pg: SupabaseClient,
  table: string,
  column: string,
  value: string
): Promise<boolean> => {
  const { data, error } = await pg.from(table).select(column).eq(column, value);

  if (error) {
    console.error("Error checking existence:", error);
    enqueueSnackbar(`Error checking for existing rows`, {
      variant: "error",
    });
    return false; // or handle error appropriately
  }

  return data.length > 0;
};

export default checkExisting;
