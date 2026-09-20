import { Router } from "express";
import { getUser } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getUser);

export default router;