import { createSupabaseServerClient } from "./server-client";

const pg = createSupabaseServerClient();

const getUserSession = async (): Promise<boolean> => {
  const { data: { session } } = await pg.auth.getSession();
  return !!session;
};

export default getUserSession;