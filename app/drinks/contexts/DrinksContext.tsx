
/**
 * @fileOverview This file contains the implementation of the ListDrinksContext and its provider component.
 * The ListDrinksContext is a React context object used for managing the list of drinks.
 */

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { DrinkSchema } from "../models";
import { queryDrinks } from "../actions";
import { getTotalCount } from "@/utils/supabase/getTotalCount";

/**
 * Type definition for the ListDrinksContext.
 */
interface ListDrinksContextType {
    drinksList: DrinkSchema[];
    setDrinksList: (newDrinkList: DrinkSchema[]) => void;
    count: number;
    setCount: (newCount: number) => void;
}

/**
 * Context object for managing the list of drinks.
 */
const ListDrinksContext = createContext<ListDrinksContextType | undefined>(
    undefined
);

/**
 * Props for the ListDrinksProvider component.
 */
interface ListDrinksProviderProps {
    children: ReactNode;
}

/**
 * Provider component for the ListDrinksContext.
 * @param children - The child components.
 */
export const ListDrinksProvider: React.FC<ListDrinksProviderProps> = ({
    children,
}) => {
    const [drinksList, setDrinksList] = useState<DrinkSchema[]>([]);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        /**
         * Fetches the list of drinks.
         */
        const fetchDrinks = async () => {
            try {
                const drinksData = await queryDrinks(1, 10);
                setDrinksList(drinksData);
            } catch (error: any) {
                console.error("Error querying drinks: ", error);
            }
        };

        /**
         * Fetches the total count of drinks.
         */
        const fetchCount = async () => {
            try {
                const countData = await getTotalCount("drinks");
                setCount(countData);
            } catch (error: any) {
                console.error("Error getting total count: ", error);
            }
        };

        fetchDrinks();
        fetchCount();
    }, []);

    return (
        <ListDrinksContext.Provider
            value={{ drinksList, setDrinksList, count, setCount }}
        >
            {children}
        </ListDrinksContext.Provider>
    );
};

/**
 * Custom hook for accessing the ListDrinksContext.
 * @returns The ListDrinksContext object.
 * @throws An error if used outside of a ListDrinksProvider.
 */
export const useListDrinks = (): ListDrinksContextType => {
    const context = useContext(ListDrinksContext);
    if (!context) {
        throw new Error("useListDrinks must be used within a ListDrinksProvider");
    }
    return context;
};
