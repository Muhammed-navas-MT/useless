export interface Center {
  x: number;
  y: number;
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DetectedObject {
  name: string;
  confidence: number;

  box: BoundingBox;

  center: Center;

  /**
   * Position normalized between 0 and 1.
   *
   * Optional so your backend remains compatible with
   * older CV-service responses.
   */
  normalizedCenter?: Center;
}

export interface DetectionResponse {
  success: boolean;

  image?: {
    width: number;
    height: number;
  };

  objects: DetectedObject[];
}

export interface MovedObject {
  object: string;

  /**
   * Relative movement score.
   *
   * IMPORTANT:
   * This is NOT centimeters.
   */
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