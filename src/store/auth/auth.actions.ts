import { createAction, props } from '@ngrx/store';
import { User } from '../../app/core/models/user.model';
import { LoginPayload, RegisterPayload } from '../../app/core/auth/auth.service';

// ─── Login ───────────────────────────────────────────────────────────────────

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginPayload }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; accessToken: string; refreshToken: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// ─── Register ────────────────────────────────────────────────────────────────

export const register = createAction(
  '[Auth] Register',
  props<{ payload: RegisterPayload }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; accessToken: string; refreshToken: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// ─── Logout ──────────────────────────────────────────────────────────────────

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

// ─── Load Current User (app init) ────────────────────────────────────────────

export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: User }>()
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure'
);

// ─── Token Refresh (interceptor-driven) ──────────────────────────────────────

export const tokenRefreshed = createAction(
  '[Auth] Token Refreshed',
  props<{ accessToken: string }>()
);
