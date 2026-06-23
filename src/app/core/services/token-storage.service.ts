import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAccessToken(): string | null {
    return this.isBrowser ? localStorage.getItem('access_token') : null;
  }

  setAccessToken(token: string | null | undefined): void {
    if (this.isBrowser) {
      if (token) localStorage.setItem('access_token', token);
      else localStorage.removeItem('access_token');
    }
  }

  getRefreshToken(): string | null {
    return this.isBrowser ? localStorage.getItem('refresh_token') : null;
  }

  setRefreshToken(token: string | null | undefined): void {
    if (this.isBrowser) {
      if (token) localStorage.setItem('refresh_token', token);
      else localStorage.removeItem('refresh_token');
    }
  }

  // Used by Engineer 2's auth.effects.ts
  setTokens(accessToken: string | null | undefined, refreshToken: string | null | undefined): void {
    if (this.isBrowser) {
      if (accessToken) localStorage.setItem('access_token', accessToken);
      else localStorage.removeItem('access_token');

      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      else localStorage.removeItem('refresh_token');
    }
  }

  // Alias for our code that used saveTokens()
  saveTokens(accessToken: string | null | undefined, refreshToken: string | null | undefined): void {
    this.setTokens(accessToken, refreshToken);
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
}
