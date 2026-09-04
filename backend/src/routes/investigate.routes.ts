import { Router } from "express";
import { upload } from "../middlewares/upload";
import { investigate } from "../controllers/investigate.controller";

const router = Router();

router.post(
  "/",
  upload.fields([
    { name: "before", maxCount: 1 },
    { name: "after", maxCount: 1 },
  ]),
  investigate
);

export default router;
