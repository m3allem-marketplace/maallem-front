import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { AuthService } from '../../app/core/auth/auth.service';
import { TokenStorageService } from '../../app/core/services/token-storage.service';
import { UserContextService } from '../../app/core/services/user-context.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  // ─── Login ──────────────────────────────────────────────────────────────────

  /**
   * Calls AuthService.login() and maps the response to loginSuccess or
   * loginFailure.  Side-effects (token storage, navigation) are handled
   * in loginSuccessEffect$ so the reducer stays pure.
   */
  loginEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(({ credentials }) => console.log('AuthEffects: Received Login Action!', credentials)),
      exhaustMap(({ credentials }) => {
        console.log('AuthEffects: Executing login service call...', credentials);
        return this.authService.login(credentials).pipe(
          tap(res => console.log('AuthEffects: Login Success Response:', res)),
          map((response) =>
            AuthActions.loginSuccess({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            })
          ),
          catchError((err) => {
            console.error('AuthEffects: Login Error Caught:', err);
            return of(
              AuthActions.loginFailure({
                error: err?.error?.message ?? 'Login failed. Please try again.',
              })
            );
          })
        );
      })
    )
  );

  // ─── Register ───────────────────────────────────────────────────────────────

  /**
   * Calls AuthService.register() and maps the response to registerSuccess or
   * registerFailure.
   */
  registerEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      tap(({ payload }) => console.log('AuthEffects: Received Register Action!', payload)),
      exhaustMap(({ payload }) => {
        console.log('AuthEffects: Executing register service call...', payload);
        return this.authService.register(payload).pipe(
          tap(res => console.log('AuthEffects: Register Success Response:', res)),
          map((response) =>
            AuthActions.registerSuccess({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            })
          ),
          catchError((err) => {
            console.error('AuthEffects: Register Error Caught:', err);
            return of(
              AuthActions.registerFailure({
                error:
                  err?.error?.message ?? 'Registration failed. Please try again.',
              })
            );
          })
        );
      })
    )
  );

  // ─── loginSuccess / registerSuccess side-effects ────────────────────────────

  /**
   * On a successful login or register:
   *  1. Persists both tokens via TokenStorageService.
   *  2. Updates UserContextService so legacy code stays in sync.
   *  3. Navigates to the correct dashboard based on the user's role.
   */
  loginSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(({ user, accessToken, refreshToken }) => {
          // 1 — persist tokens
          this.tokenStorage.setTokens(accessToken, refreshToken);

          // 2 — keep the imperative UserContextService in sync
          this.userContext.setUser(user);

          // 3 — role-based navigation
          if (user.role === 'user') {
            this.router.navigate(['/customer/dashboard']);
          } else if (user.role === 'worker' || user.role === 'company') {
            this.router.navigate(['/worker/dashboard']);
          }
        })
      ),
    { dispatch: false }
  );

  // ─── Logout ─────────────────────────────────────────────────────────────────

  /**
   * Calls AuthService.logout() (best-effort — we clear tokens even on error),
   * then dispatches logoutSuccess to reset the store.
   */
  logoutEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          // Still dispatch logoutSuccess so local state is cleared
          catchError(() => of(AuthActions.logoutSuccess()))
        )
      )
    )
  );

  /**
   * After logoutSuccess: clears persisted tokens, resets UserContextService,
   * and navigates to the home page.
   */
  logoutSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.tokenStorage.clear();
          this.userContext.clearUser();
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  // ─── Load Current User (app init) ───────────────────────────────────────────

  /**
   * Dispatched on app init (via APP_INITIALIZER or AppComponent.ngOnInit).
   * Fetches the current user from the API using the stored token.
   * On failure it dispatches loadCurrentUserFailure — the reducer will clear
   * user and token from state so the app reflects the unauthenticated state.
   */
  loadCurrentUserEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      exhaustMap(() =>
        this.authService.getMe().pipe(
          map((response) =>
            AuthActions.loadCurrentUserSuccess({ user: response.data.user })
          ),
          catchError(() => of(AuthActions.loadCurrentUserFailure()))
        )
      )
    )
  );

  /**
   * On successful user load, keep UserContextService in sync with the store.
   */
  loadCurrentUserSuccessEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loadCurrentUserSuccess),
        tap(({ user }) => {
          this.userContext.setUser(user);
        })
      ),
    { dispatch: false }
  );
}
