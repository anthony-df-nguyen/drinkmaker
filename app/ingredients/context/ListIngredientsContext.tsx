
/**
 * Context for managing the list of ingredients.
 */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { IngredientsSchema } from "../models";
import { queryAllIngredients } from "../actions";
import { getTotalCount } from "@/utils/supabase/getTotalCount";

/**
 * Type definition for the ListIngredientsContext.
 */
interface ListIngredientsContextType {
  ingredients: IngredientsSchema[];
  setIngredients: (newIngredients: IngredientsSchema[]) => void;
  count: number;
  setCount: (newCount: number) => void;
}

/**
 * Context object for managing the list of ingredients.
 */
const ListIngredientsContext = createContext<ListIngredientsContextType | undefined>(undefined);

/**
 * Props for the ListIngredientsProvider component.
 */
interface ListIngredientsProviderProps {
  children: ReactNode;
}

/**
 * Provider component for the ListIngredientsContext.
 * @param children - The child components.
 */
export const ListIngredientsProvider: React.FC<ListIngredientsProviderProps> = ({ children }) => {
  const [ingredients, setIngredients] = useState<IngredientsSchema[]>([]);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    /**
     * Fetches the list of ingredients.
     */
    const fetchIngredients = async () => {
      try {
        const ingredientsData = await queryAllIngredients(1, 10);
        setIngredients(ingredientsData);
      } catch (error: any) {
        console.error("Error querying ingredients: ", error);
      }
    };

    /**
     * Fetches the total count of ingredients.
     */
    const fetchCount = async () => {
      try {
        const countData = await getTotalCount("ingredients");
        setCount(countData);
      } catch (error: any) {
        console.error("Error getting total count: ", error);
      }
    };

    fetchIngredients();
    fetchCount();
  }, []);

  return (
    <ListIngredientsContext.Provider value={{ ingredients, setIngredients, count, setCount }}>
      {children}
    </ListIngredientsContext.Provider>
  );
};

/**
 * Custom hook for accessing the ListIngredientsContext.
 * @returns The ListIngredientsContext object.
 * @throws An error if used outside of a ListIngredientsProvider.
 */
export const useListIngredients = (): ListIngredientsContextType => {
  const context = useContext(ListIngredientsContext);
  if (!context) {
    throw new Error("useListIngredients must be used within a ListIngredientsProvider");
  }
  return context;
};