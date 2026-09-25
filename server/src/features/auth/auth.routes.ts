import { Router } from "express";
import { getUser, updateUser } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getUser);
router.patch("/me", authMiddleware, updateUser);

export default router;