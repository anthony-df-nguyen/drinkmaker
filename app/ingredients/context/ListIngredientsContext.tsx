import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { IngredientsSchema } from "../models";
import { queryIngredients, queryAllIngredients } from "../actions";
import { getTotalCount } from "@/utils/supabase/getTotalCount";

interface ListIngredientsContextType {
  ingredients: IngredientsSchema[];
  setIngredients: (newIngredients: IngredientsSchema[]) => void;
  allIngredients: IngredientsSchema[];
  setAllIngredients: (newIngredients: IngredientsSchema[]) => void;
  count: number;
  setCount: (newCount: number) => void;
}

const ListIngredientsContext = createContext<
  ListIngredientsContextType | undefined
>(undefined);

interface ListIngredientsProviderProps {
  children: ReactNode;
}

export const ListIngredientsProvider: React.FC<
  ListIngredientsProviderProps
> = ({ children }) => {
  const [ingredients, setIngredients] = useState<IngredientsSchema[]>([]);
  const [allIngredients, setAllIngredients] = useState<IngredientsSchema[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      console.debug("Fetching ingredients...from context");

      try {
        const [ingredientsData, allIngredientData, countData] = await Promise.all([
          queryIngredients(1, 10),
          queryAllIngredients(),
          getTotalCount("ingredients")
        ]);

        setIngredients(ingredientsData);
        setAllIngredients(allIngredientData);
        setCount(countData);

      } catch (error: any) {
        console.error("Error fetching initial data: ", error);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <ListIngredientsContext.Provider
      value={{
        ingredients,
        setIngredients,
        count,
        setCount,
        allIngredients,
        setAllIngredients,
      }}
    >
      {children}
    </ListIngredientsContext.Provider>
  );
};

export const useListIngredients = (): ListIngredientsContextType => {
  const context = useContext(ListIngredientsContext);
  if (!context) {
    throw new Error(
      "useListIngredients must be used within a ListIngredientsProvider"
    );
  }
  return context;
};