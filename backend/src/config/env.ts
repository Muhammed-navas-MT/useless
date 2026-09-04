import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  cvServiceUrl: requireEnv("CV_SERVICE_URL", "http://localhost:8000"),
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  llmModel: process.env.LLM_MODEL ?? "openai/gpt-oss-20b",
  movementThreshold: Number(process.env.MOVEMENT_THRESHOLD ?? 50),
};
