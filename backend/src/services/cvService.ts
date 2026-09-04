import axios from "axios";
import FormData from "form-data";
import { env } from "../config/env";
import { AppError } from "../middlewares/errorHandler";
import { DetectionResponse } from "../types";

export async function detectObjects(
  imageBuffer: Buffer,
  filename: string
): Promise<DetectionResponse> {
  const form = new FormData();
  form.append("file", imageBuffer, filename);

  try {
    const response = await axios.post<DetectionResponse>(
      `${env.cvServiceUrl}/detect`,
      form,
      { headers: form.getHeaders() }
    );
    return response.data;
  } catch (error) {
    throw new AppError(
      `Failed to reach CV service: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
      502
    );
  }
}
