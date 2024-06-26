"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/browser-client";
import { User } from "@supabase/supabase-js";

interface AuthenticatedContextProps {
  session: boolean;
  user: User | null;
  setSession: (session: boolean) => void;
  setUser: (user: User | null) => void;
}

const supabase = createSupabaseBrowserClient();

// Create the context with a default value
const AuthenticatedContext = createContext<AuthenticatedContextProps | undefined>(undefined);

interface AuthenticatedProviderProps {
  children: ReactNode;
}

export const AuthenticatedProvider: React.FC<AuthenticatedProviderProps> = ({ children }) => {
  const [session, setSession] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      setSession(false);
      setUser(null);
    } else {
      setSession(true);
      setUser(data.user);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthenticatedContext.Provider value={{ session, user, setSession, setUser }}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAuthenticatedContext = (): AuthenticatedContextProps => {
  const context = useContext(AuthenticatedContext);
  if (!context) {
    throw new Error("useAuthenticatedContext must be used within an AuthenticatedProvider");
  }
  return context;
};