import { env } from "../config/env";
import { euclideanDistance } from "../utils/distance";
import { ComparisonResult, DetectedObject } from "../types";

/**
 * Compare BEFORE and AFTER detections.
 *
 * IMPORTANT:
 * - YOLO gives us image coordinates.
 * - Distance is therefore measured in PIXELS.
 * - We do NOT call pixels "centimeters".
 *
 * For better comparison, normalizedCenter is used when available.
 *
 * Normalized coordinates:
 *   x = centerX / imageWidth
 *   y = centerY / imageHeight
 *
 * This reduces problems caused by different image resolutions.
 *
 * NOTE:
 * If the camera itself moves significantly between BEFORE and AFTER,
 * normalized coordinates alone cannot determine real-world movement.
 * The user should ideally capture both images from the same viewpoint.
 */

export function compareDetections(
  before: DetectedObject[],
  after: DetectedObject[],
  movementThreshold: number = env.movementThreshold,
): ComparisonResult {
  const result: ComparisonResult = {
    moved: [],
    missing: [],
    new: [],
    unchanged: [],
  };

  /**
   * For the MVP we assume one object of each class.
   *
   * If multiple objects of the same class are required later,
   * we should implement box/center-based object matching.
   */
  const beforeMap = createObjectMap(before);
  const afterMap = createObjectMap(after);

  // ---------------------------------------------------------
  // CHECK OBJECTS FROM BEFORE
  // ---------------------------------------------------------

  for (const [name, beforeObject] of beforeMap.entries()) {
    const afterObject = afterMap.get(name);

    // Object existed BEFORE but does not exist AFTER.
    if (!afterObject) {
      result.missing.push(name);
      continue;
    }

    /**
     * Prefer normalized coordinates.
     *
     * If normalizedCenter doesn't exist, fall back to
     * regular pixel coordinates.
     */
    const distance = calculateDistance(beforeObject, afterObject);

    if (distance > movementThreshold) {
      result.moved.push({
        object: name,
        distance: Math.round(distance),
      });
    } else {
      result.unchanged.push(name);
    }
  }

  // ---------------------------------------------------------
  // CHECK NEW OBJECTS
  // ---------------------------------------------------------

  for (const name of afterMap.keys()) {
    if (!beforeMap.has(name)) {
      result.new.push(name);
    }
  }

  return result;
}

/**
 * Create a map of object name -> detection.
 *
 * If YOLO detects the same class multiple times, the highest
 * confidence detection is kept.
 */
function createObjectMap(
  objects: DetectedObject[],
): Map<string, DetectedObject> {
  const map = new Map<string, DetectedObject>();

  for (const object of objects) {
    const existing = map.get(object.name);

    if (!existing || object.confidence > existing.confidence) {
      map.set(object.name, object);
    }
  }

  return map;
}

/**
 * Calculate distance between BEFORE and AFTER.
 *
 * If normalized coordinates are available, use them.
 *
 * IMPORTANT:
 * This distance is still a relative image-space distance.
 * It is NOT centimeters.
 */
function calculateDistance(
  beforeObject: DetectedObject,
  afterObject: DetectedObject,
): number {
  if (beforeObject.normalizedCenter && afterObject.normalizedCenter) {
    return (
      euclideanDistance(
        beforeObject.normalizedCenter,
        afterObject.normalizedCenter,
      ) * 1000
    );
  }

  return euclideanDistance(beforeObject.center, afterObject.center);
}
