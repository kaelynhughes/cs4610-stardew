export type Ingredient = {
  id: number;
  name: string;
  description: string;
  totalQuantity: number;
};

export type Recipe = {
  id: number;
  name: string;
  description: string;
};

export type RecipeIngredient = {
  ingredientName?: string;
  recipeName?: string;
  ingredientId: number;
  recipeId: number;
  quantity: number;
};
