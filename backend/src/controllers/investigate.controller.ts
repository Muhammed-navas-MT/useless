import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import { runInvestigation } from "../services/investigateService";

interface InvestigateFiles {
  before?: Express.Multer.File[];
  after?: Express.Multer.File[];
}

export async function investigate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const files = req.files as InvestigateFiles;
    const beforeFile = files?.before?.[0];
    const afterFile = files?.after?.[0];

    if (!beforeFile || !afterFile) {
      throw new AppError(
        "Both 'before' and 'after' images are required",
        400
      );
    }

    const result = await runInvestigation(
      beforeFile.buffer,
      afterFile.buffer
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
