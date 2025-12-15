import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { IngredientsSchema } from "../models";
import { queryIngredientsWithCount, queryAllIngredients } from "../actions";

type ListMode = "browse" | "search";

interface ListIngredientsContextType {
  ingredients: IngredientsSchema[];
  setIngredients: Dispatch<SetStateAction<IngredientsSchema[]>>;

  allIngredients: IngredientsSchema[];
  setAllIngredients: Dispatch<SetStateAction<IngredientsSchema[]>>;

  // Total number of ingredients in the DB (used for pagination/infinite scroll)
  count: number;
  setCount: Dispatch<SetStateAction<number>>;

  // Explicit mode so list UIs can disable infinite scroll during search
  mode: ListMode;
  setMode: Dispatch<SetStateAction<ListMode>>;

  // Helper: restore browse state (page 1 + correct total count)
  refreshBrowseFirstPage: () => Promise<void>;
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
  const [mode, setMode] = useState<ListMode>("browse");

  const PAGE_SIZE = 10;

  const refreshBrowseFirstPage = useCallback(async () => {
    const { data, totalCount } = await queryIngredientsWithCount(1, PAGE_SIZE);
    setIngredients(data);
    setCount(totalCount);
    setMode("browse");
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [_, allIngredientData] = await Promise.all([
          refreshBrowseFirstPage(),
          queryAllIngredients(),
        ]);

        setAllIngredients(allIngredientData);
      } catch (error: any) {
        console.error("Error fetching initial data: ", error);
      }
    };

    fetchInitialData();
  }, [refreshBrowseFirstPage]);

  return (
    <ListIngredientsContext.Provider
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