import { createReducer, on } from '@ngrx/store';
import { User } from '../../app/core/models/user.model';
import * as AuthActions from './auth.actions';

// ─── State Shape ─────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, accessToken }) => ({
    ...state,
    user,
    accessToken,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { user, accessToken }) => ({
    ...state,
    user,
    accessToken,
    loading: false,
    error: null,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
  })),

  // Load current user (app init)
  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.loadCurrentUserFailure, (state) => ({
    ...state,
    user: null,
    accessToken: null,
    loading: false,
  })),

  // Token refresh — only update the stored access token, leave everything else
  on(AuthActions.tokenRefreshed, (state, { accessToken }) => ({
    ...state,
    accessToken,
  }))
);
