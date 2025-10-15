import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingPanelComponent } from './shopping-panel.component';

describe('ShoppingPanelComponent', () => {
  let component: ShoppingPanelComponent;
  let fixture: ComponentFixture<ShoppingPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
