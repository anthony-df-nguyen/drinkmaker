import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useMemo,
  } from "react";
  import { DrinkSchema } from "../models";
  import { queryDrinks } from "../actions";
  import { getTotalCount } from "@/utils/supabase/getTotalCount";
  
  interface ListDrinksContextType {
    drinksList: DrinkSchema[];
    setDrinksList: (newDrinkList: DrinkSchema[]) => void;
    count: number;
    setCount: (newCount: number) => void;
  }
  
  const ListDrinksContext = createContext<ListDrinksContextType | undefined>(undefined);
  
  interface ListDrinksProviderProps {
    children: ReactNode;
  }
  
  export const ListDrinksProvider: React.FC<ListDrinksProviderProps> = ({ children }) => {
    const [drinksList, setDrinksList] = useState<DrinkSchema[]>([]);
    const [count, setCount] = useState<number>(0);
  
    useEffect(() => {
      const fetchInitialData = async () => {
        console.log("Initial fetch of drinks on mount");
        try {
          const [drinksData, totalCount] = await Promise.all([
            queryDrinks(1, 10, undefined, undefined),
            getTotalCount("drinks")
          ]);
  
          setDrinksList(drinksData.data);
          setCount(totalCount);
        } catch (error: any) {
          console.error("Error querying drinks: ", error);
        }
      };
  
      fetchInitialData();
    }, []);
  
    const contextValue = useMemo(
      () => ({
        drinksList,
        setDrinksList,
        count,
        setCount,
      }),
      [drinksList, count]
    );
  
    return (
      <ListDrinksContext.Provider value={contextValue}>
        {children}
      </ListDrinksContext.Provider>
    );
  };
  
  export const useListDrinks = (): ListDrinksContextType => {
    const context = useContext(ListDrinksContext);
    if (!context) {
      throw new Error("useListDrinks must be used within a ListDrinksProvider");
    }
    return context;
  };