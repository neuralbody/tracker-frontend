import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

interface AuthResponse { token: string; }

@Injectable({
  providedIn: 'root' // singleton across app
})
export class AuthService {
  private readonly TOKEN_KEY = 'tracker_token';
  private base = `${environment.apiBaseUrl}/auth`;

  private _isLogged$ = new BehaviorSubject<boolean>(this.hasValidToken());
  public isLogged$ = this._isLogged$.asObservable();

  constructor(private http: HttpClient, private router : Router) {}

  register(username: string | undefined | null, password: string | null | undefined): Observable<any> {
    return this.http.post<void>(`${this.base}/register`, { username, password });
  }

  login(username: string | undefined | null, password: string | null | undefined) : Observable<void> {
    return this.http.post<AuthResponse>(`${this.base}/login`, { username, password })
      .pipe(
        tap(res => {
          if (res && res.token) {
            this.setToken(res.token);
            this._isLogged$.next(true);
          }
      }),
      map(()=> void 0)
    );
  }

  logout(redirect = true) {
    localStorage.removeItem(this.TOKEN_KEY);
    this._isLogged$.next(false);
    if (redirect) this.router.navigate(['/login']);
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this._isLogged$.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this._isLogged$.value;
  }

  private hasValidToken(): boolean {
    const t = this.getToken();
    if (!t) return false;
    try {
      const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload?.exp) {
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
      }
      return true;
    } catch {
      return false;
    }
  }
}
