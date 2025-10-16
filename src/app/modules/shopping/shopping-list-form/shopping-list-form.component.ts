import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recipe, ShoppingList } from '../../../core/models/shoppingModels';
import { ShoppingService } from '../../../core/services/shopping.service';

@Component({
  selector: 'app-shopping-list-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shopping-list-form.component.html',
  styleUrl: './shopping-list-form.component.scss'
})
export class ShoppingListFormComponent {

  @Input() recipes: Recipe[] = [];
  @Output() created = new EventEmitter<ShoppingList>();

  form = this.fb.group({
    title: ['', Validators.required],
    ingredients: this.fb.array([ this.fb.group({ name: ['', Validators.required], quantity: ['1'] }) ]),
    selectedRecipeIds: [[]] as any
  });

  constructor(private fb: FormBuilder, private shoppingService: ShoppingService) {}

  get ingredients() { 
    return this.form.get('ingredients') as FormArray; 
  }

  addItem() { 
    this.ingredients.push(
      this.fb.group({ 
        name: ['', Validators.required], 
        quantity: ['1'] })
      ); 
  }

  removeItem(i: number) { 
    if (this.ingredients.length <= 1) return;
    
    const group = this.ingredients.at(i)
    if(group)
      group.markAllAsTouched();

    this.ingredients.removeAt(i);
  }

  submit() {
    if (this.form.invalid) return;

    const raw = this.form.value as {
      title?: string | null;
      ingredients?: { name?: string | null; quantity?: string | null }[];
      selectedRecipeIds?: number[];
    };

    const payload: Partial<ShoppingList> = {
      title: (raw.title ?? '').toString().trim(),

      ingredients: (raw.ingredients ?? []).map((it: any) => ({
        name: (it?.name ?? '').toString().trim(),
        quantity: (it?.quantity ?? '').toString().trim()
      })),

      recipes: (raw.selectedRecipeIds ?? [])
      .map((rid: any) => {
        const id = Number(rid);
        return Number.isFinite(id) ? { id, title: '' } : null;
      }).filter(Boolean) as {id: number; title: string}[]

    };

    this.shoppingService.createList(payload).subscribe({
      next: list => {
        (this as any).modalRef?.close(list);

        this.form.reset();
        this.ingredients.clear();
        this.addItem();
      },
      error: err => {
        console.error(err);
        (this as any).modalRef?.close(null);
      }
    });
  }
}
