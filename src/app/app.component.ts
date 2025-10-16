import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { ModalHostComponent } from './modules/modal/modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NavbarComponent, 
    FooterComponent,
    ModalHostComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  isLogged$: Observable<boolean>;
  sidebarOpen = false;

  constructor(public auth: AuthService, private router: Router) {
    this.isLogged$ = this.auth.isLogged$;
  }

  onSidebarToggle(open: boolean) {
    this.sidebarOpen = open;
  }

  logout() {
    this.auth.logout();
    this.auth.isLogged$;
    this.router.navigate(['/login']);
  }
}
