"use client";
import React, {
  useState,
  ReactNode,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { IngredientsSchema } from "../models";
import { queryIngredients, queryAllIngredients } from "../actions";
import type { ListMode } from "@/types";
import { createTypedContext } from "@/context/createListContext";

interface ListIngredientsContextType {
  ingredients: IngredientsSchema[];
  setIngredients: Dispatch<SetStateAction<IngredientsSchema[]>>;

  allIngredients: IngredientsSchema[];
  setAllIngredients: Dispatch<SetStateAction<IngredientsSchema[]>>;

  count: number;
  setCount: Dispatch<SetStateAction<number>>;

  mode: ListMode;
  setMode: Dispatch<SetStateAction<ListMode>>;

  refreshBrowseFirstPage: () => Promise<void>;
}

const PAGE_SIZE = 10;

const { Context, useTypedContext } =
  createTypedContext<ListIngredientsContextType>("ListIngredients");

interface ListIngredientsProviderProps {
  children: ReactNode;
}

export const ListIngredientsProvider: React.FC<
  ListIngredientsProviderProps
> = ({ children }) => {
  const [ingredients, setIngredients] = useState<IngredientsSchema[]>([]);
  const [allIngredients, setAllIngredients] = useState<IngredientsSchema[]>([]);
  const [count, setCount] = useState<number>(0);
  const [mode, setMode] = useState<ListMode>("browse");

  const refreshBrowseFirstPage = useCallback(async () => {
    const { data, totalCount } = await queryIngredients(1, PAGE_SIZE, true);
    setIngredients(data);
    setCount(totalCount ?? 0);
    setMode("browse");
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [, allIngredientData] = await Promise.all([
          refreshBrowseFirstPage(),
          queryAllIngredients(),
        ]);
        setAllIngredients(allIngredientData);
      } catch (error) {
        console.error("Error fetching initial data: ", error);
      }
    };
    fetchInitialData();
  }, [refreshBrowseFirstPage]);

  return (
    <Context.Provider
      value={{
        ingredients,
        setIngredients,
        count,
        setCount,
        allIngredients,
        setAllIngredients,
        mode,
        setMode,
        refreshBrowseFirstPage,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useListIngredients = useTypedContext;
