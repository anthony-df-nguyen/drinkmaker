export interface DrinkSchema {
  id: string;
  name: string;
  unique_name: string;
  description: string;
  picture: string;
  created_by: string;
  created_on: string;
  updated_on: string;
  upvotes: number;
  downvotes: number;
  published: boolean;
  drink_type: string;
  is_alcoholic: boolean;
  profiles: {
    username: string | null;
  };
}

export type DrinkWithUsername = DrinkSchema & { username: string | null };

export interface CreateDrinkFields {
  name: string;
  unique_name: string;
  description: string;
  created_by: string;
  drink_type: string;
  is_alcoholic: boolean;
}

export interface MutableDrinkFields {
  name: string;
  unique_name?: string;
  description?: string;
  picture: string | null;
  upvotes?: number;
  downvotes?: number;
  published?: boolean;
  drink_type: string;
  is_alcoholic: boolean;
}

export const drinkTypes = [
  { value: "all", label: "All" },
  { value: "cocktail", label: "Cocktail" },
  { value: "coffee", label: "Coffee" },
  { value: "juice", label: "Juice" },
  { value: "shake", label: "Shake" },
  { value: "smoothie", label: "Smoothie" },
  { value: "tea", label: "Tea" },
  { value: "other", label: "Other" },
];

// Options used in forms — excludes the "all" sentinel
export const drinkTypeFormOptions = drinkTypes.filter((t) => t.value !== "all");

// "Yes / No / Not specified" options for the is_alcoholic select field
export const alcoholicOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export const encodeAlcoholic = (v: boolean): string => (v ? "true" : "false");

export const decodeAlcoholic = (v: "true" | "false"): boolean => v === "true";

export const drinkTypeColors: Record<string, string> = {
  cocktail: "bg-blue-100",
  coffee: "bg-yellow-100",
  juice: "bg-emerald-100",
  shake: "bg-pink-100",
  smoothie: "bg-red-100",
  tea: "bg-orange-100",
  other: "bg-surface-raised",
};
