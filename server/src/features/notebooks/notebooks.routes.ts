import {Router} from "express";

import {
    create,
    getAll,
    getById,
    update,
    remove
}
from "./notebooks.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
router.use(authMiddleware)

router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;