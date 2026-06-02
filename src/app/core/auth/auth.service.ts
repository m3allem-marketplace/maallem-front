import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserContextService } from '../services/user-context.service';
import { TokenStorageService } from '../services/token-storage.service';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private userContext: UserContextService
  ) {}

  register(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/register`, payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.tokenStorage.saveTokens(res.data.accessToken, res.data.refreshToken);
          this.userContext.setUser(res.data.user);
          this.tokenStorage.saveUser(res.data.user);
        }
      })
    );
  }

  login(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.tokenStorage.saveTokens(res.data.accessToken, res.data.refreshToken);
          this.userContext.setUser(res.data.user);
          this.tokenStorage.saveUser(res.data.user);
        }
      })
    );
  }

  getMe(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/auth/me`).pipe(
      tap((res) => {
        if (res.success && res.data && res.data.user) {
          this.userContext.setUser(res.data.user);
          this.tokenStorage.saveUser(res.data.user);
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    return this.http.post<any>(`${this.baseUrl}/auth/refresh-token`, { refreshToken }).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.tokenStorage.saveTokens(res.data.accessToken, refreshToken || '');
          this.userContext.setUser(res.data.user);
          this.tokenStorage.saveUser(res.data.user);
        }
      })
    );
  }

  logout(payload: any = {}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/logout`, payload).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  logoutAll(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/logout-all`, {}).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  initSession(): void {
    const savedUser = this.tokenStorage.getUser();
    const token = this.tokenStorage.getAccessToken();
    if (savedUser && token) {
      this.userContext.setUser(savedUser);
    }
  }

  private clearSession(): void {
    this.tokenStorage.clear();
    this.userContext.clearUser();
  }
}
