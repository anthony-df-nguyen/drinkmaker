"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server-client";

const pg = createSupabaseServerClient();

const updateUserName = async (
  userID: string,
  username: string
): Promise<null> => {
  const { data, error } = await pg
    .from("profiles")
    .upsert([{ id: userID, username }], { onConflict: "id" });
  if (error) {
    console.error("Error updating username", error);
    throw error;
  }
  return data;
};

export { updateUserName };
