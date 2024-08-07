// context/DrinkFormContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import {
  getDrinkIngredients,
  upsertDrinkIngredients,
} from "./drink_ingredients/actions";
import {
  getDrinkInstructionByID,
  upsertDrinkInstruction,
} from "./instructions/actions";
import { updateDrinkBasics, getDrinkByID } from "../actions";
import {
  DrinkIngredientDetail,
  InsertDrinkIngredients,
} from "./drink_ingredients/models";
import {useRouter} from "next/navigation";
import { MutableDrinkFields } from "../models";
import { enqueueSnackbar } from "notistack";

export type GlobalDrinkForm = {
  name: string;
  unique_name: string;
  drink_type: string;
  id: string;
  description: string;
  ingredients: DrinkIngredientDetail[];
  instructions: string | null;
  created_by_user_id: string;
  created_by_user: string;
};

interface DrinkFormContextProps {
  globalDrinkForm: GlobalDrinkForm;
  setGlobalDrinkForm: React.Dispatch<React.SetStateAction<GlobalDrinkForm>>;
  loading: boolean;
  error: string | null;
  formSubmitted: boolean;
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const DrinkFormContext = createContext<DrinkFormContextProps | undefined>(
  undefined
);

export const DrinkFormProvider: React.FC<{
  slug: string;
  children: ReactNode;
}> = ({ slug, children }) => {
  const [globalDrinkForm, setGlobalDrinkForm] = useState<GlobalDrinkForm>({
    name: "",
    unique_name: "",
    drink_type: "",
    id: "",
    description: "",
    ingredients: [],
    instructions: null,
    created_by_user_id: "",
    created_by_user: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const fetchGlobalDrinkForm = async (slug: string) => {
    setLoading(true);
    try {
      const basic = await getDrinkByID(slug);
      const [ingredients, instructions] = await Promise.all([
        getDrinkIngredients(basic.id),
        getDrinkInstructionByID(basic.id),
      ]);

      const newForm = {
        id: basic.id,
        name: basic.name,
        unique_name: basic.unique_name,
        description: basic.description,
        ingredients: ingredients
          ? ingredients.map((ingredient) => ({
              ingredient_id: ingredient.ingredient_id,
              drink_id: ingredient.drink_id,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
            }))
          : [],
        instructions: instructions?.instructions ?? null,
        drink_type: basic.drink_type,
        created_by_user_id: basic.created_by,
        created_by_user: basic.profiles?.username ?? "Unknown",
      };

      setGlobalDrinkForm(newForm);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateDatabase = async () => {
    if (!formSubmitted) return;
    setLoading(true);
    try {
      const { id, name, description, drink_type, ingredients, instructions } =
        globalDrinkForm;

      const basicDrinkPayload: MutableDrinkFields = {
        name,
        description,
        drink_type,
      };
      await updateDrinkBasics(id, basicDrinkPayload);

      const ingredientPayload: InsertDrinkIngredients = {
        drink_id: id,
        ingredient_details: ingredients,
      };
      await upsertDrinkIngredients(ingredientPayload);

      await upsertDrinkInstruction(id, instructions);
      setLoading(false);
      enqueueSnackbar("Drink successfully updated", { variant: "success" });

      setTimeout(() => {
        router.push(`/`);
      }, 1000);
    } catch (error) {
      console.error("Failed to update the database: ", error);
      enqueueSnackbar("There was an error updating the drink", {
        variant: "error",
      });
    } finally {
      setFormSubmitted(false);
    }
  };

  useEffect(() => {
    fetchGlobalDrinkForm(slug);
  }, [slug]);

  useEffect(() => {
    updateDatabase();
  }, [globalDrinkForm, formSubmitted]);

  return (
    <DrinkFormContext.Provider
      value={{
        globalDrinkForm,
        setGlobalDrinkForm,
        loading,
        error,
        formSubmitted,
        setFormSubmitted,
      }}
    >
      {children}
    </DrinkFormContext.Provider>
  );
};

export const useGlobalDrinkForm = () => {
  const context = useContext(DrinkFormContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalDrinkForm must be used within a DrinkFormProvider"
    );
  }
  return context;
};
