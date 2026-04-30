import type { DrinkIngredientDetail } from "./drink_ingredients/models";

export type GlobalDrinkForm = {
  name: string;
  unique_name: string;
  drink_type: string;
  is_alcoholic: boolean;
  id: string;
  description: string;
  ingredients: DrinkIngredientDetail[];
  instructions: string | null;
  created_by_user_id: string;
  created_by_user: string;
  picture: string | null;
};
