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
  styleUrls: ['./recipe-form.component.scss']
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
      title: (raw.title ?? '').toString().trim(),
      ingredients: (raw.ingredients ?? []).map(it => ({
        name: (it?.name ?? '').toString().trim(),
        quantity: (it?.quantity ?? '1').toString().trim()
      }))
    };

    this.shoppingService.createRecipe(payload).subscribe({
      next: recipe => {
        (this as any).modalRef?.close(recipe);
        
        this.form.reset();
        this.ingredients.clear();
        this.addIngredient();
      },
      error: err => {
        console.error(err);
        (this as any).modalRef?.close(null);
      }
    });
  }
}
