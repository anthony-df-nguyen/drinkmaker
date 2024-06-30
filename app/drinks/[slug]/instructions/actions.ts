"use server";
import { createSupabaseServerComponentClient } from "@/utils/supabase/server-client";
import { DrinkInstructionSchema, InstructionFormat } from "./models";


const pg = createSupabaseServerComponentClient();

const getDrinkInstructionByID = async (
  drink_id: string
): Promise< {instructions: InstructionFormat} | null> => {
  const { data, error } = await pg
    .from("drink_instructions")
    .select("instructions")
    .eq("drink_id", drink_id)
    .single();

  if (error) {
    console.error(`Error querying instructions`, error);
    return null;
    //throw new Error(`Error querying for instructions: ${error.message}`);
  } else {
    return data;
  }
};

const upsertDrinkInstruction = async (
  drink_id: string,
  instructions: InstructionFormat,
): Promise<void> => {
  const { data, error } = await pg
    .from("drink_instructions")
    .upsert([{ drink_id: drink_id, instructions: instructions }], {
      onConflict: "drink_id",
    });

  if (error) {
    console.error("Error upserting instruction:", error);
    throw new Error(`Error upserting instruction: ${error.message}`);
  } else {
    console.log("Upsert successful:", data);
  }
};



export { getDrinkInstructionByID, upsertDrinkInstruction };
