import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenStorageService } from '../services/token-storage.service';
import { UserContextService } from '../services/user-context.service';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly userContext = inject(UserContextService);

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response) => {
        if (response && response.success && response.data) {
          this.tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
          this.userContext.setUser(response.data.user);
          const role = response.data.user.role;
          if (role === 'user') {
            this.router.navigate(['/customer/dashboard']);
          } else if (role === 'worker' || role === 'company') {
            this.router.navigate(['/worker/dashboard']);
          }
        }
      })
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((response) => {
        if (response && response.success && response.data) {
          this.tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
          this.userContext.setUser(response.data.user);
          const role = response.data.user.role;
          if (role === 'user') {
            this.router.navigate(['/customer/dashboard']);
          } else if (role === 'worker' || role === 'company') {
            this.router.navigate(['/worker/dashboard']);
          }
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = this.tokenStorage.getAccessToken();
    const refreshToken = this.tokenStorage.getRefreshToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }, { headers }).pipe(
      tap({
        next: () => {
          this.tokenStorage.clear();
          this.userContext.clearUser();
          this.router.navigate(['/']);
        },
        error: () => {
          this.tokenStorage.clear();
          this.userContext.clearUser();
          this.router.navigate(['/']);
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    const headers = refreshToken ? new HttpHeaders({ Authorization: `Bearer ${refreshToken}` }) : undefined;
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh-token`, {}, { headers });
  }

}
