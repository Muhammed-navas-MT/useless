import { detectObjects } from "./cvService";
import { compareDetections } from "./comparisonService";
import { generateInvestigationReport } from "./llmService";
import { InvestigationResult } from "../types";

/**
 * Runs the complete investigation pipeline:
 *
 * BEFORE image
 *      ↓
 * YOLO detection
 *
 * AFTER image
 *      ↓
 * YOLO detection
 *
 *      ↓
 * Compare
 *
 *      ↓
 * Moved / Missing / New / Unchanged
 *
 *      ↓
 * Serious AI investigation report
 */
export async function runInvestigation(
  beforeBuffer: Buffer,
  afterBuffer: Buffer,
): Promise<InvestigationResult> {
  // Detect both images in parallel.
  const [beforeDetections, afterDetections] = await Promise.all([
    detectObjects(beforeBuffer, "before.jpg"),
    detectObjects(afterBuffer, "after.jpg"),
  ]);

  console.log(
    "[investigation] BEFORE detections:",
    JSON.stringify(beforeDetections, null, 2),
  );

  console.log(
    "[investigation] AFTER detections:",
    JSON.stringify(afterDetections, null, 2),
  );

  // Compare detections.
  const comparison = compareDetections(
    beforeDetections.objects,
    afterDetections.objects,
  );

  console.log(
    "[investigation] COMPARISON:",
    JSON.stringify(comparison, null, 2),
  );

  // Generate serious forensic report.
  const report = await generateInvestigationReport(comparison);

  return {
    ...comparison,
    report,
  };
}
