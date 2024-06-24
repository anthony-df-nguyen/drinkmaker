import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a row in the specified table with the given values.
 * @param pg - Supabase client instance.
 * @param table - The table to insert into.
 * @param value - Object with the values to insert.
 * @returns A boolean indicating if the row was inserted successfully.
 */
const createRow = async <T>(
  pg: SupabaseClient,
  table: string,
  value: T
): Promise<boolean> => {
  const { error } = await pg.from(table).insert(value);

  if (error) {
    console.error("Error creating row:", error);
    return false;
  }

  return true;
};

export default createRow;