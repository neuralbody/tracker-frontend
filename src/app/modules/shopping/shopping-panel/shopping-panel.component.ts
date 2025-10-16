import { Component, OnInit } from '@angular/core';
import { ShoppingListFormComponent } from '../shopping-list-form/shopping-list-form.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ingredient, Recipe, ShoppingList } from '../../../core/models/shoppingModels';
import { ShoppingService } from '../../../core/services/shopping.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-shopping-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, RecipeFormComponent, ShoppingListFormComponent],
  templateUrl: './shopping-panel.component.html',
  styleUrl: './shopping-panel.component.scss'
})
export class ShoppingPanelComponent implements OnInit {

  lists: ShoppingList[] = [];
  recipes: Recipe[] = [];
  loading = false;
  selectedList?: ShoppingList;
  showCreateList = false;
  showCreateRecipe = false;

  constructor(private shoppingService: ShoppingService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.load();
    this.loadRecipes();
  }

  load() {
    this.loading = true;
    this.shoppingService.getLists().subscribe({
      next: data => { this.lists = data; this.loading = false; },
      error: () => { this.loading = false; alert('Erreur chargement listes'); }
    });
  }

  loadRecipes() {
    this.shoppingService.getRecipes().subscribe({
      next: data => this.recipes = data,
      error: () => this.recipes = []
    });
  }

  onListCreated(list: ShoppingList) {
    this.lists.unshift(list);
    this.showCreateList = false;
  }

  onRecipeCreated(recipe: Recipe) {
    this.recipes.unshift(recipe);
    this.showCreateRecipe = false;
  }

  openList(list: ShoppingList) { this.selectedList = list; }

  addRecipeToList(list: ShoppingList, recipeId: number) {
    if (!list.id || !recipeId) return alert('Erreur');
    this.shoppingService.addRecipeToList(list.id, recipeId).subscribe({
      next: () => this.load(),
      error: () => alert('Impossible d\'ajouter la recette')
    });
  }

  addIngredientToList(list: ShoppingList, ingredient: Ingredient) {
    if (!list.id) return;
    if (!ingredient || !ingredient.name) { alert('Nom obligatoire'); return; }
    this.shoppingService.addIngredientToList(list.id, ingredient).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur ajout ingrédient')
    });
  }

  deleteList(list: ShoppingList) {
    if (!list.id) return;
    if (!confirm('Supprimer cette liste ?')) return;
    this.shoppingService.deleteList(list.id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur suppression')
    });
  }

  openCreateListModal() {
    this.modalService.open(ShoppingListFormComponent, { recipes: this.recipes })
      .subscribe((result: any) => {
        if (result) this.lists.unshift(result);
      });
  }

  openCreateRecipeModal() {
    this.modalService.open(RecipeFormComponent)
      .subscribe((result: any) => {
        if (result) this.recipes.unshift(result);
      });
  }

}
