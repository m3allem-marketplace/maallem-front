// ─── TASK 1.1 ── JWT Payload ─────────────────────────────────────────────────

export interface JwtPayload {
  sub:   string;   // userId
  email: string;
  role:  string;   // UserRole string value
  iat:   number;
  exp:   number;
}
