import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { UserRole } from '../../app/core/models/user.model';

// ─── Feature Selector ─────────────────────────────────────────────────────────

export const selectAuthState = createFeatureSelector<AuthState>('auth');

// ─── Derived Selectors ────────────────────────────────────────────────────────

/** The currently authenticated user, or null if not logged in. */
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

/** True when there is an authenticated user in the store. */
export const selectIsLoggedIn = createSelector(
  selectCurrentUser,
  (user) => user !== null
);

/** The authenticated user's role, or null if not logged in. */
export const selectUserRole = createSelector(
  selectCurrentUser,
  (user): UserRole | null => (user ? user.role : null)
);

/** True while an auth operation (login / register / loadMe) is in flight. */
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

/** The last auth error message, or null if no error. */
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

/** The in-memory access token (useful for interceptors / debug). */
export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.accessToken
);
