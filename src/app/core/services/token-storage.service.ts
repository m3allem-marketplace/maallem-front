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

  setAccessToken(token: string): void {
    if (this.isBrowser) localStorage.setItem('access_token', token);
  }

  getRefreshToken(): string | null {
    return this.isBrowser ? localStorage.getItem('refresh_token') : null;
  }

  setRefreshToken(token: string): void {
    if (this.isBrowser) localStorage.setItem('refresh_token', token);
  }

  // Used by Engineer 2's auth.effects.ts
  setTokens(accessToken: string, refreshToken: string): void {
    if (this.isBrowser) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Alias for our code that used saveTokens()
  saveTokens(accessToken: string, refreshToken: string): void {
    this.setTokens(accessToken, refreshToken);
  }

  clear(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
}
