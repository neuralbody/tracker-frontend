import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {
    this.isLogged$ = this.auth.isLogged$;
  }

  isLogged$: Observable<boolean>;
  sidebarOpen = false;

  onSidebarToggle(open: boolean) {
    this.sidebarOpen = open;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
