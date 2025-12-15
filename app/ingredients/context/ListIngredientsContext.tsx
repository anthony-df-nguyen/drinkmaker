import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { IngredientsSchema } from "../models";
import { queryIngredientsWithCount, queryAllIngredients } from "../actions";

interface ListIngredientsContextType {
  ingredients: IngredientsSchema[];
  setIngredients: Dispatch<SetStateAction<IngredientsSchema[]>>;
  allIngredients: IngredientsSchema[];
  setAllIngredients: Dispatch<SetStateAction<IngredientsSchema[]>>;
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
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
      try {
        const [{ data: ingredientsData, totalCount }, allIngredientData] =
          await Promise.all([
            queryIngredientsWithCount(1, 10),
            queryAllIngredients(),
          ]);

        setIngredients(ingredientsData);
        setAllIngredients(allIngredientData);
        setCount(totalCount);
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