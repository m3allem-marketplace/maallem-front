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
        if (this.isBrowser) {
            return localStorage.getItem('access_token');
        }
        return null;
    }

    setAccessToken(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem('access_token', token);
        }
    }

    getRefreshToken(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem('refresh_token');
        }
        return null;
    }

    setRefreshToken(token: string): void {
        if (this.isBrowser) {
            localStorage.setItem('refresh_token', token);
        }
    }

    setTokens(accessToken: string, refreshToken: string): void {
        if (this.isBrowser) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
        }
    }

    clear(): void {
        if (this.isBrowser) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
    }
}
