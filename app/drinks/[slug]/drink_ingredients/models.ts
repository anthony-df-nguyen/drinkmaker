export interface DrinkIngredientDetail {
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export interface DrinkIngredientViewData {
  name: string,
  quantity: number;
  unit: string;
}

export type DrinkIngredientSchema = {
  drink_id: string;
} & DrinkIngredientDetail;

export type InsertDrinkIngredients = {
  drink_id: string;
  ingredient_details: DrinkIngredientDetail[];
};
