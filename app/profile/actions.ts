"use server";

import { createSupabaseServerActionClient } from "@/utils/supabase/server-client";
import type { Profile } from "@/types";

export async function updateUserName(
  userID: string,
  username: string
): Promise<Profile> {
  const pg = await createSupabaseServerActionClient();

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
