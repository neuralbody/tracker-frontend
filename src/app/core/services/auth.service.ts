import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse { token: string; }

@Injectable({
  providedIn: 'root' // singleton across app
})
export class AuthService {
  private base = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(username: string | undefined | null, password: string | null | undefined): Observable<any> {
    return this.http.post(`${this.base}/register`, { username, password });
  }

  login(username: string | undefined | null, password: string | null | undefined) {
    return this.http.post<AuthResponse>(`${this.base}/login`, { username, password })
      .pipe(tap(resp => {
        if (resp && resp.token) {
          localStorage.setItem('jwt', resp.token);
        }
      }));
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
