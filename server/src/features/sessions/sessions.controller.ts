import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, sendError } from "../../utils/apiResponse";
import {
  createSessionSchema,
  updateSessionSchema,
} from "./sessions.schema";
import { sessionsService } from "./sessions.service";

export const startSession = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }

    const body = createSessionSchema.parse(req.body);
    const session = await sessionsService.start(
      req.user.id,
      body.resourceId,
    );

    return sendSuccess(res, session, 201);
  },
);

export const listSessions = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }

    const sessions = await sessionsService.list(req.user.id);

    return sendSuccess(res, sessions);
  },
);

export const getSession = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }

    const session = await sessionsService.getbyId(
      req.params.id,
      req.user.id,
    );

    return sendSuccess(res, session);
  },
);

export const updateSession = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }

    const body = updateSessionSchema.parse(req.body);
    const session = await sessionsService.finish(
      req.params.id,
      req.user.id,
      body.status,
    );

    return sendSuccess(res, session);
  },
);

export const deleteSession = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }

    await sessionsService.delete(req.params.id, req.user.id);

    return sendSuccess(res, { message: "Session deleted successfully" });
  },
);