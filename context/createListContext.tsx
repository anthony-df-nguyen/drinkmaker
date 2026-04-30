"use client";
import { createContext, useContext } from "react";

/**
 * Generic factory for typed React contexts that throw a helpful error
 * when consumed outside their provider. Removes the boilerplate of
 * re-implementing `createContext` + a hook for every list/page state
 * provider in the app.
 *
 * @example
 *   type Value = { items: Foo[]; setItems: Dispatch<...> };
 *   const { Context, useTypedContext } = createTypedContext<Value>("Foo");
 *   // <Context.Provider value={...}>{children}</Context.Provider>
 *   // const { items } = useTypedContext();
 */
export function createTypedContext<TValue>(displayName: string) {
  const Context = createContext<TValue | undefined>(undefined);
  Context.displayName = displayName;

  function useTypedContext(): TValue {
    const value = useContext(Context);
    if (value === undefined) {
      throw new Error(
        `use${displayName} must be used within ${displayName}Provider`,
      );
    }
    return value;
  }

  return { Context, useTypedContext };
}
