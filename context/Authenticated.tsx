"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import type { AuthenticatedUser } from "@/types";

interface AuthenticatedContextProps {
  user: AuthenticatedUser | null;
  setUser: (user: AuthenticatedUser | null) => void;
}

const pg = createSupabaseBrowserClient();

const AuthenticatedContext = createContext<
  AuthenticatedContextProps | undefined
>(undefined);

interface AuthenticatedProviderProps {
  children: ReactNode;
}

export const getUserName = async (userId: string): Promise<string> => {
  const { data, error } = await pg
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.username;
};

export const getUserSession = async (): Promise<AuthenticatedUser | null> => {
  try {
    const {
      data: { user },
      error: authError,
    } = await pg.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!user) {
      return null;
    }

    const username = await getUserName(user.id);
    return { ...user, username } as AuthenticatedUser;
  } catch (error) {
    console.info("No user session was found", error);
    return null;
  }
};

export const AuthenticatedProvider: React.FC<AuthenticatedProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  const checkAuth = async () => {
    try {
      const user = await getUserSession();
      setUser(user);
    } catch (error) {
      setUser(null);
      console.error("Error checking authentication: ", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthenticatedContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

export const useAuthenticatedContext = (): AuthenticatedContextProps => {
  const context = useContext(AuthenticatedContext);
  if (!context) {
    throw new Error(
      "useAuthenticatedContext must be used within an AuthenticatedProvider"
    );
  }
  return context;
};
