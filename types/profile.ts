import type { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string | null;
}

export type AuthenticatedUser = User & { username: string };
