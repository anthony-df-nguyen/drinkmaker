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
  profiles: {
    username: string | null;
  }
}

export interface CreateDrinkFields {
  name: string;
  unique_name: string;
  description: string;
  created_by: string;
  drink_type: string;
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
}

export const drinkTypes = [
  { value: "all", label: "All" },
  { value: "cocktail", label: "Cocktail" },
  // { value: "coffee", label: "Coffee" },
  // { value: "juice", label: "Juice" },
  { value: "mocktail", label: "Mocktail" },
  { value: "shake", label: "Shake" },
  { value: "smoothie", label: "Smoothie" },
  { value: "tea", label: "Tea" },
  { value: "other", label: "Other" },
];

export const drinkTypeColors: {
  [key: string]: string;
} = {
  cocktail: "bg-blue-100",
  coffee: "bg-yellow-100",
  juice: "bg-emerald-100",
  mocktail: "bg-purple-100",
  shake: "bg-pink-100",
  smoothie: "bg-red-100",
  tea: "bg-orange-100",
  other: "bg-gray-100",
};
