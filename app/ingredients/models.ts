
/**
 * Represents the schema for an ingredient.
 */
export interface IngredientsSchema {
  /**
   * The name of the ingredient.
   */
  name: string;
  
  /**
   * The unique identifier of the ingredient.
   */
  id: string;
  
  /**
   * The image URL of the ingredient (optional).
   */
  image?: string;
}

/**
 * Represents the fields required to create an ingredient.
 */
export interface CreateIngredientFields {
  /**
   * The name of the ingredient.
   */
  name: string;
  
  /**
   * The image URL of the ingredient (optional).
   */
  image?: string;
}

/**
 * Represents the mutable fields of an ingredient.
 */
export interface MutableIngredientFields {
  /**
   * The updated name of the ingredient (optional).
   */
  name?: string;
  
  /**
   * The updated image URL of the ingredient (optional).
   */
  image?: string;
}
