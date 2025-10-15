import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Ingredient, Recipe, ShoppingList } from "../models/shoppingModels";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ShoppingService {
  private baseLists = `${environment.apiBaseUrl}/shopping`
  private baseRecipes = `${environment.apiBaseUrl}/recipes`

  constructor(private http: HttpClient) {}

  getLists(): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(this.baseLists);
  }
  getList(id: number): Observable<ShoppingList> {
    return this.http.get<ShoppingList>(`${this.baseLists}/${id}`);
  }
  createList(payload: Partial<ShoppingList>): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(this.baseLists, payload);
  }
  updateList(id: number, payload: Partial<ShoppingList>): Observable<ShoppingList> {
    return this.http.put<ShoppingList>(`${this.baseLists}/${id}`, payload);
  }
  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseLists}/${id}`);
  }

  // recipes
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseRecipes);
  }
  createRecipe(payload: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseRecipes, payload);
  }

  addIngredientToList(listId: number, ingredient: Ingredient): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(`${this.baseLists}/${listId}/items`, ingredient);
  }

  addRecipeToList(listId: number, recipeId: number): Observable<ShoppingList> {
    return this.http.post<ShoppingList>(`${this.baseLists}/${listId}/recipes`, { recipeId });
  }


}