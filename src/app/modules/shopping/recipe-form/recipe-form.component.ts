import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShoppingService } from '../../../core/services/shopping.service';
import { Recipe } from '../../../core/models/shoppingModels';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.scss'
})
export class RecipeFormComponent {
  @Output() created = new EventEmitter<Recipe>();

  form = this.fb.group({
    title: ['', Validators.required],
    ingredients: this.fb.array([ this.fb.group({ name: ['', Validators.required], quantity: ['1'] }) ])
  });

  constructor(private fb: FormBuilder, private shoppingService: ShoppingService) {}

  get ingredients() { 
    return this.form.get('ingredients') as FormArray; 
  }

  addIngredient() { 
    this.ingredients.push(
      this.fb.group({ name: ['', Validators.required], quantity: ['1'] })
    ); 
  }

  removeIngredient(i: number) { 
    if (this.ingredients.length > 1) this.ingredients.removeAt(i); 
  }

  submit() {
    if (this.form.invalid) return;
    
    const raw = this.form.value;

    const payload: Partial<Recipe> = {
      title: (raw.title ?? '').toString(),
      ingredients: (raw.ingredients ?? []).map((it: any) => ({
        name: (it.name ?? '').toString(),
        quantity: (it.quantity ?? '').toString()
      }))
    };

    this.shoppingService.createRecipe(payload).subscribe({
      next: r => {
        this.created.emit(r);
        this.form.reset();
        while(this.ingredients.length) this.ingredients.removeAt(0);
        this.addIngredient();
      },
      error: () => alert('Erreur création recette')
    });
  }
}
