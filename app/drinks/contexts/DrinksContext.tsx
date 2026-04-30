"use client";
import React, { useState, useMemo, ReactNode, Dispatch, SetStateAction } from "react";
import { DrinkSchema } from "../models";
import { createTypedContext } from "@/context/createListContext";

interface ListDrinksContextType {
  drinksList: DrinkSchema[];
  setDrinksList: Dispatch<SetStateAction<DrinkSchema[]>>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}

const { Context, useTypedContext } =
  createTypedContext<ListDrinksContextType>("ListDrinks");

interface ListDrinksProviderProps {
  children: ReactNode;
}

export const ListDrinksProvider: React.FC<ListDrinksProviderProps> = ({
  children,
}) => {
  const [drinksList, setDrinksList] = useState<DrinkSchema[]>([]);
  const [count, setCount] = useState<number>(0);

  const value = useMemo(
    () => ({ drinksList, setDrinksList, count, setCount }),
    [drinksList, count],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useListDrinks = useTypedContext;
