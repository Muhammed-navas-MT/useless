import { Center } from "../types";

/**
 * Calculate Euclidean distance between two points.
 *
 * distance = sqrt(
 *   (afterX - beforeX)^2 +
 *   (afterY - beforeY)^2
 * )
 */
export function euclideanDistance(before: Center, after: Center): number {
  const dx = after.x - before.x;
  const dy = after.y - before.y;

  return Math.sqrt(dx * dx + dy * dy);
}
