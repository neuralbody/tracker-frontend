import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShoppingPanelComponent } from '../shopping-panel/shopping-panel.component';

@Component({
  selector: 'app-shopping-page',
  standalone: true,
  imports: [CommonModule, ShoppingPanelComponent],
  templateUrl: './shopping-page.component.html',
  styleUrl: './shopping-page.component.scss'
})
export class ShoppingPageComponent {

}
