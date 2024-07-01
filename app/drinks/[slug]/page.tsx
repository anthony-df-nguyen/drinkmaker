"use client";
import { useState, useEffect, useCallback } from "react";
import DrinkBasics from "./DrinkBasics";
import DrinkInstructions from "./instructions/DrinkInstructions";
import DrinkIngredients from "./drink_ingredients/DrinkIngredients";
import MartiniLoader from "@/components/UI/Loading";
import { DrinkSchema } from "../models";
import { getDrinkByID } from "../actions";
import Navigation from "@/components/Layout/Navigation";
import { enqueueSnackbar } from "notistack";
import { ListIngredientsProvider } from "@/app/ingredients/context/ListIngredientsContext";

/**
 * Renders the page for a specific drink.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.params - The parameters object containing the drink slug.
 * @param {string} props.params.slug - The slug of the drink.
 * @returns {JSX.Element} The rendered page component.
 */
const Page: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const { slug } = params;
  const [drinkData, setDrinkData] = useState<DrinkSchema>();

  /**
   * Fetches drink data by ID and updates the state with the fetched data.
   * If an error occurs, it displays a snackbar with an error message.
   */
  const fetchData = useCallback(async () => {
    try {
      const data = await getDrinkByID(slug);
      setDrinkData(data);
    } catch (error) {
      enqueueSnackbar(`Error loading ${slug}`, { variant: "error" });
    }
  }, [slug]);

  // Fetch data on mount and when edit mode is toggled
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderComponents = () => {
    return (
      drinkData && (
        <main>
          <div className="grid gap-8  max-w-[1200px] w-full mx-auto">
            <DrinkBasics drink={drinkData} />
            <hr />
            <DrinkIngredients drinkID={drinkData.id} />
            <hr />
            <DrinkInstructions drinkID={drinkData.id} />
          </div>
        </main>
      )
    );
  };

  return (
    <Navigation>
      <ListIngredientsProvider>
        <main>{drinkData ? renderComponents() : <MartiniLoader />}</main>
      </ListIngredientsProvider>
    </Navigation>
  );
};

export default Page;
