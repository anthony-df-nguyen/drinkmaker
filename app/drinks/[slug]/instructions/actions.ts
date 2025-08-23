"use server";

import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
import { InstructionFormat } from "./models";

/** Read a drink's instructions (null if none). */
const getDrinkInstructionByID = async (
  drink_id: string
): Promise<{ instructions: InstructionFormat } | null> => {
  const pg = await createSupabaseServerActionClient();

  // maybeSingle(): returns null (no error) when no row exists
  const { data, error } = await pg
    .from("drink_instructions")
    .select("instructions")
    .eq("drink_id", drink_id)
    .maybeSingle();

  if (error) {
    console.error("Error querying instructions:", error);
    return null;
  }
  return data as { instructions: InstructionFormat } | null;
};

/** Insert or update a drink's instructions (by drink_id). */
const upsertDrinkInstruction = async (
  drink_id: string,
  instructions: InstructionFormat
): Promise<void> => {
  const pg = await createSupabaseServerActionClient();

  const { error } = await pg
    .from("drink_instructions")
    .upsert(
      [{ drink_id, instructions }],
      { onConflict: "drink_id" }
    );

  if (error) {
    console.error("Error upserting instruction:", error);
    throw new Error(`Error upserting instruction: ${error.message}`);
  }
};

export { getDrinkInstructionByID, upsertDrinkInstruction };
