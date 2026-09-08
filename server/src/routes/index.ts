import {Router} from "express";

import authRoutes from "../features/auth/auth.routes";

import resourcesRoutes from "../features/resources/resources.routes";

import notebooksRoutes from "../features/notebooks/notebooks.routes";

import sessionsRouter from "../features/sessions/sessions.routes";

import aiRoutes from "../features/ai/ ai.routes";

const router = Router();

router.use("/auth" , authRoutes);
router.use("/resources" , resourcesRoutes);
router.use("/notebooks", notebooksRoutes);
router.use("/sessions", sessionsRouter);
router.use("/ai", aiRoutes);

export default router;