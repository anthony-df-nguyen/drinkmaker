"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { useTheme } from "next-themes";

export type FinalUserObject = User & { username: string };

interface AuthenticatedContextProps {
  user: FinalUserObject | null;
  setUser: (user: FinalUserObject | null) => void;
}

const pg = createSupabaseBrowserClient();

// Create the context with a default value
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

export const getUserSession = async (): Promise<FinalUserObject | null> => {
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
    return { ...user, username } as FinalUserObject;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
};

export const AuthenticatedProvider: React.FC<AuthenticatedProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<FinalUserObject | null>(null);

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

// Custom hook for consuming the context
export const useAuthenticatedContext = (): AuthenticatedContextProps => {
  const context = useContext(AuthenticatedContext);
  if (!context) {
    throw new Error(
      "useAuthenticatedContext must be used within an AuthenticatedProvider"
    );
  }
  return context;
};
