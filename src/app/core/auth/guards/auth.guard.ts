import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn : 'root'
})  
export class authGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    // optionally pass returnUrl
    return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url }});
  }
};
