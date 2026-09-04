// Mirrors backend/src/types/index.ts exactly — do not add fields the API
// doesn't actually return.

export interface MovedObject {
  object: string;
  distance: number;
}

export interface ComparisonResult {
  moved: MovedObject[];
  missing: string[];
  new: string[];
  unchanged: string[];
}

export interface InvestigationResult extends ComparisonResult {
  report: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
