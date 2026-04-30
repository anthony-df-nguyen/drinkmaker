export interface DrinkIngredientDetail {
  ingredient_id: string;
  quantity: number;
  unit: string;
  role: string;
}

export interface DrinkIngredientViewData {
  name: string;
  quantity: number;
  unit: string;
  role: string;
  displayQty: string;
  displayUnit: string;
  isVolumeUnit: boolean;
  isOverridden: boolean;
}

export type DrinkIngredientSchema = {
  drink_id: string;
} & DrinkIngredientDetail;

export type InsertDrinkIngredients = {
  drink_id: string;
  ingredient_details: DrinkIngredientDetail[];
};
