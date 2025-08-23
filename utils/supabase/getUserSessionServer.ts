// utils/supabase/getUserSessionServer.ts
import { User } from "@supabase/supabase-js";
import { createSupabaseServerComponentClient } from "./server-client";

export default async function getUserSessionOnServer(): Promise<User | null> {
  const supabase = await createSupabaseServerComponentClient(); // ✅ inside request scope
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user session:", error);
    return null;
  }
  return data.user ?? null;
}
