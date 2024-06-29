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
  instructions: string | null;
  ingredients: string | null;
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
  description: string;
  picture: string;
  upvotes: number;
  downvotes: number;
  published: boolean;
  drink_type: string;
  instructions: string | null;
  ingredients: string | null;
}
