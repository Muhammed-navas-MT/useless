import type { ApiResponse, InvestigationResult } from "../types/investigation";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000";

export class InvestigationRequestError extends Error {}

/**
 * Submits the BEFORE/AFTER evidence photographs to the backend's
 * POST /api/investigate endpoint (multipart, fields "before" and "after")
 * and returns the parsed investigation result.
 */
export async function submitInvestigation(
  before: Blob,
  after: Blob
): Promise<InvestigationResult> {
  const formData = new FormData();
  formData.append("before", before, "before.jpg");
  formData.append("after", after, "after.jpg");

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/investigate`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new InvestigationRequestError(
      "Unable to reach the investigation server."
    );
  }

  let payload: ApiResponse<InvestigationResult>;
  try {
    payload = await response.json();
  } catch {
    throw new InvestigationRequestError(
      "The investigation server returned an unreadable response."
    );
  }

  if (!payload.success) {
    throw new InvestigationRequestError(payload.error);
  }

  return payload.data;
}
