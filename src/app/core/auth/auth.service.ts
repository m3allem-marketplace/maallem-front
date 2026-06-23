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
  email:    string;
  password: string;
}

export interface RegisterPayload {
  name:            string;
  email:           string;
  phone:           string;
  password:        string;
  confirmPassword: string;
  role?:           UserRole;
}

export interface AuthResponse {
  success:  boolean;
  message?: string;
  data: {
    user:         User;
    accessToken:  string;
    refreshToken: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http         = inject(HttpClient);
  private readonly router       = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly userContext  = inject(UserContextService);

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload);
  }

  logout(): Observable<any> {
    const token        = this.tokenStorage.getAccessToken();
    const refreshToken = this.tokenStorage.getRefreshToken();
    const headers      = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }, { headers });
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    const headers      = refreshToken ? new HttpHeaders({ Authorization: `Bearer ${refreshToken}` }) : undefined;
    return this.http.post<any>(
      `${environment.apiUrl}/auth/refresh-token`,
      { refreshToken },
      { headers }
    );
  }

  /** Fetches authenticated user profile — used by NgRx loadCurrentUser effect */
  getMe(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${environment.apiUrl}/auth/me`);
  }
}
