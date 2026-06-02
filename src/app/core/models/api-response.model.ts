// ─── TASK 1.8 ── API Response Wrappers ──────────────────────────────────────

export interface ApiResponse<T> {
  success:   boolean;
  data:      T;
  message:   string | null;
  timestamp: string;
}

export interface ApiError {
  success:    false;
  statusCode: number;
  error:      string;
  message:    string;
  details?:   Record<string, string[]>;  // field-level validation errors
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export function isApiError(res: ApiResult<unknown>): res is ApiError {
  return res.success === false && 'statusCode' in res;
}
