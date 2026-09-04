import { Router } from "express";
import healthRoutes from "./health.routes";
import investigateRoutes from "./investigate.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/api/investigate", investigateRoutes);

export default router;
