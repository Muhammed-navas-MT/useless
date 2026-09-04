import Groq from "groq-sdk";
import { env } from "../config/env";
import { AppError } from "../middlewares/errorHandler";
import { ComparisonResult } from "../types";

const groq = new Groq({
  apiKey: env.groqApiKey,
});

function buildPrompt(comparison: ComparisonResult): string {
  return `You are an extremely serious digital forensic investigator.

You are writing a fictional investigation report for:

"D.F.I. — Digital Forensic Investigation Unit"

CASE: "WHO MOVED MY STUFF?"

You are given BEFORE vs AFTER object-detection evidence.

Evidence:
${JSON.stringify(comparison, null, 2)}

Write a SHORT, simple, funny forensic report.

IMPORTANT:
- Do NOT create separate sections for MOVED, MISSING, NEW, or UNCHANGED.
- Combine all findings naturally into ONE investigation paragraph.
- The humor should come from treating a normal desk/room change like a very serious criminal investigation.
- Keep the investigator completely serious.
- Do not use emojis.
- Do not use markdown bold.
- Do not use asterisks.
- Do not invent objects or evidence.
- Do not say an object physically moved. Say its detected position changed.
- Distance values are image-space movement scores, NOT centimeters or meters.
- Never convert them to centimeters or meters.

Keep it simple and easy to read.

FORMAT:

CASE #[generate a random case number]

SUBJECT: [short funny title]

INVESTIGATION REPORT:
Write one short paragraph describing what happened. Naturally mention the important moved, missing, new, and unchanged objects when they exist. Make it sound like a serious forensic investigation, but the situation itself should be funny.

CONCLUSION:
One short funny but serious sentence.

SUSPICION LEVEL: [0-100]%

RECOMMENDATION:
One short absurdly serious recommendation.

Maximum 120 words.
`;
}

export async function generateInvestigationReport(
  comparison: ComparisonResult,
): Promise<string> {
  if (!env.groqApiKey) {
    throw new AppError("GROQ_API_KEY is not configured", 500);
  }

  try {
    const response = await groq.chat.completions.create({
      model: env.llmModel,

      messages: [
        {
          role: "user",
          content: buildPrompt(comparison),
        },
      ],

      temperature: 0.3,
    });

    return (response.choices[0]?.message?.content ?? "").trim();
  } catch (error) {
    throw new AppError(
      `Failed to generate investigation report from Groq: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
      502,
    );
  }
}
