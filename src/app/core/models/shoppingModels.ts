export interface Ingredient {
  id?: number;
  name: string;
  quantity?: string;
}

export interface Recipe {
  id?: number;
  title: string;
  ingredients: Ingredient[];
}

export interface ShoppingList {
  id?: number;
  title: string;
  createdAt?: string;
  ingredients: Ingredient[];
  recipes?: { id?: number; title: string }[];
}