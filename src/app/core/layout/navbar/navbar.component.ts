import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  sidebarOpen = false;
  isLogged$: Observable<boolean>;

  @Output() toggleSide = new EventEmitter<boolean>();

  constructor(private auth: AuthService, private router: Router) {
    this.isLogged$ = this.auth.isLogged$;
  }

  toggle() {
    this.sidebarOpen = !this.sidebarOpen;
    this.toggleSide.emit(this.sidebarOpen);
  }

  logout() {
    this.auth.logout(true);
  }

  navigateTo(path: string) {
    this.sidebarOpen = false;
    this.toggleSide.emit(false);
    this.router.navigate([path]);
  }
}
