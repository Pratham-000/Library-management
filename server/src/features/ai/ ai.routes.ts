import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { embedNote, embedResource, search } from "./ai.controller";

const router = Router();

router.use(authMiddleware);

router.post("/resources/:id/embed", embedResource);
router.post("/notes/:id/embed", embedNote);
router.post("/search", search);

export default router;