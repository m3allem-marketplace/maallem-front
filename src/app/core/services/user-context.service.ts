import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TokenStorageService } from './token-storage.service';
import { User, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';
import * as AuthActions from '../../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private readonly http           = inject(HttpClient);
  private readonly tokenStorage   = inject(TokenStorageService);
  private readonly store          = inject(Store);

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public  readonly isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map(user => user !== null)
  );
  public  readonly role$: Observable<UserRole | null> = this.currentUser$.pipe(
    map(user => user?.role ?? null)
  );

  private readonly initializedSubject = new BehaviorSubject<boolean>(false);
  public  readonly initialized$: Observable<boolean> = this.initializedSubject.asObservable();

  constructor() {
    const token = this.tokenStorage.getAccessToken();
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<{ success: boolean; data: { user: User } }>(
        `${environment.apiUrl}/auth/me`, { headers }
      ).subscribe({
        next: (res) => {
          if (res?.success && res?.data?.user) {
            this.setUser(res.data.user);
            // Synchronize with NgRx Auth Store on startup
            this.store.dispatch(AuthActions.loadCurrentUserSuccess({ user: res.data.user }));
            this.store.dispatch(AuthActions.tokenRefreshed({ accessToken: token }));
          } else {
            this.clearUser();
            this.store.dispatch(AuthActions.loadCurrentUserFailure());
          }
          this.initializedSubject.next(true);
        },
        error: (err) => {
          // ─── Bug Fix #1 ───────────────────────────────────────────────────────
          // A 429 (Too Many Requests) means the server is rate-limiting us,
          // NOT that the user's session is invalid. Treat it as a temporary
          // hiccup: keep the existing token and mark the user as initialized
          // using the locally-stored token so guards pass through.
          // Only wipe the session on genuine auth errors (401, 403) or
          // unrecoverable situations where we have no token context.
          if (err?.status === 429) {
            console.warn('UserContextService: /auth/me rate-limited (429). Preserving existing session.');
            // Dispatch the stored token back to the store so state is consistent
            this.store.dispatch(AuthActions.tokenRefreshed({ accessToken: token }));
            // Mark initialized so guards don't block indefinitely
            this.initializedSubject.next(true);
            return;
          }

          // If the token is invalid or expired (401/403), remove it from local storage
          // so the user doesn't get stuck in a "semi-logged in" state.
          if (err?.status === 401 || err?.status === 403) {
            this.tokenStorage.clear();
          }

          // All other errors (401, network failure, 5xx): clear the session
          this.clearUser();
          this.store.dispatch(AuthActions.loadCurrentUserFailure());
          this.initializedSubject.next(true);
        },
      });
    } else {
      this.clearUser();
      this.store.dispatch(AuthActions.loadCurrentUserFailure());
      this.initializedSubject.next(true);
    }
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  get role(): UserRole | null {
    return this.currentUser?.role ?? null;
  }
}
