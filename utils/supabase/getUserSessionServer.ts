import { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server-client";

const pg = createSupabaseServerClient();

export const getUserSessionOnServer = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await pg.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    } else {
      console.log("user", user);
      return user;
    }
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
};

export default getUserSessionOnServer;
