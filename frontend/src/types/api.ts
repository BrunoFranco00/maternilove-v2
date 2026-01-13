/**
 * Tipos internos para API
 */

export interface ApiError {
  status: number;
  message: string;
  raw?: any;
  requestId?: string;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
