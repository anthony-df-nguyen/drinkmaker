import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

import { DrinkSchema } from "../models";
  
interface ListDrinksContextType {
  drinksList: DrinkSchema[];
  setDrinksList: React.Dispatch<React.SetStateAction<DrinkSchema[]>>;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}
  
  const ListDrinksContext = createContext<ListDrinksContextType | undefined>(undefined);
  
  interface ListDrinksProviderProps {
    children: ReactNode;
  }
  
  export const ListDrinksProvider: React.FC<ListDrinksProviderProps> = ({ children }) => {
    const [drinksList, setDrinksList] = useState<DrinkSchema[]>([]);
    const [count, setCount] = useState<number>(0);
  
    // Initial data fetch is now handled in the component
    // No need to fetch initial data here since it's done in the component
  
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