// ─── API Response Models ──────────────────────────────────────────────────────
// Merged: Engineer 2's ApiResponse<T> + our PaginatedResponse<T> and ApiError

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success:  boolean;
  message?: string;
  data:     T[];
  total:    number;
  page:     number;
  limit:    number;
  pages:    number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
