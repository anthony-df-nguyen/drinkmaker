"use server";

import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
// import type { Database } from "@/types/supabase"; // if you have generated types
// type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Profile = { id: string; username: string | null }; // minimal shape if no generated types

export async function updateUserName(
  userID: string,
  username: string
): Promise<Profile> {
  const pg = await createSupabaseServerActionClient(); // ✅ action-scoped client

  const { data, error } = await pg
    .from("profiles")
    .upsert({ id: userID, username }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Error updating username", error);
    throw new Error(error.message);
  }

  return data as Profile;
}
