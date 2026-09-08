import { Router } from 'express';

import {authMiddleware} from '../../middleware/auth.middleware';

import 
{
    startSession,
    listSessions,
    getSession,
    updateSession,
    deleteSession
} from './sessions.controller'

export const sessionsRouter = Router();

sessionsRouter.use(authMiddleware);

sessionsRouter.post('/', startSession);
sessionsRouter.get("/",listSessions);
sessionsRouter.get("/:id",getSession);
sessionsRouter.patch("/:id",updateSession);
sessionsRouter.delete("/:id",deleteSession);

export default sessionsRouter;