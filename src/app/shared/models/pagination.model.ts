// ─── TASK 1.8 ── Pagination Models ───────────────────────────────────────────
// Engineer 1's Pagination<T> is kept in shared/models for display components.
// This file adds the API-layer shapes and request params used in HTTP services.

export interface PaginationMeta {
  currentPage: number;
  pageSize:    number;
  totalItems:  number;
  totalPages:  number;
  hasNext:     boolean;
  hasPrev:     boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta:  PaginationMeta;
}

export interface PaginationParams {
  page:     number;
  pageSize: number;
}