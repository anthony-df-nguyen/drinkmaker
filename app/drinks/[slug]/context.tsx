// context/DrinkFormContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { getDrinkByID } from "../actions";
import { getDrinkIngredients } from "./drink_ingredients/actions";
import { getDrinkInstructionByID } from "./instructions/actions";
import { DrinkIngredientDetail } from "./drink_ingredients/models";

export type GlobalDrinkForm = {
  name: string;
  unique_name: string;
  drink_type: string;
  id: string;
  description?: string;
  ingredients?: DrinkIngredientDetail[] | null;
  instructions?: string | null;
};

interface DrinkFormContextProps {
  globalDrinkForm: GlobalDrinkForm | null;
  setGlobalDrinkForm: React.Dispatch<React.SetStateAction<GlobalDrinkForm | null>>;
  loading: boolean;
  error: string | null;
}

const DrinkFormContext = createContext<DrinkFormContextProps | undefined>(undefined);

export const DrinkFormProvider: React.FC<{ slug: string; children: ReactNode }> = ({ slug, children }) => {
  const [globalDrinkForm, setGlobalDrinkForm] = useState<GlobalDrinkForm | null>(null);
  console.log(globalDrinkForm)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalDrinkForm = async () => {
      setLoading(true);
      try {
        const basic = await getDrinkByID(slug);

        // Fetch ingredients and instructions
        const [ingredients, instructions] = await Promise.all([
          getDrinkIngredients(basic.id),
          getDrinkInstructionByID(basic.id)
        ]);

        const newForm = {
          id: basic.id,
          name: basic.name,
          unique_name: basic.unique_name,
          description: basic.description,
          ingredients: ingredients ? ingredients.map((ingredient) => ({
            ingredient_id: ingredient.ingredient_id, // Add ingredient_id property
            drink_id: ingredient.drink_id,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })) : null,
          instructions: instructions ? instructions.instructions : null,
          drink_type: basic.drink_type,
        };

        setGlobalDrinkForm(newForm);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGlobalDrinkForm();
  }, [slug]);

  // useEffect(() => {
  //   if (globalDrinkForm) {
  //     console.log("Updated globalDrinkForm: ", globalDrinkForm);
  //   }
  // }, [globalDrinkForm]);

  return (
    <DrinkFormContext.Provider value={{ globalDrinkForm, setGlobalDrinkForm, loading, error }}>
      {children}
    </DrinkFormContext.Provider>
  );
};

export const useGlobalDrinkForm = () => {
  const context = useContext(DrinkFormContext);
  if (context === undefined) {
    throw new Error("useGlobalDrinkForm must be used within a DrinkFormProvider");
  }
  return context;
};