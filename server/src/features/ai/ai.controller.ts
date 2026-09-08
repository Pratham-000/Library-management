import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess, sendError } from "../../utils/apiResponse";
import { searchSchema } from "./ai.schema";
import { aiService } from "./ai.service";

export const embedResource = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) return sendError(res, "Unauthorized", 401);

    const result = await aiService.embedResource(req.params.id, req.user.id);
    return sendSuccess(res, result, 201);
  },
);

export const embedNote = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user) return sendError(res, "Unauthorized", 401);

    const result = await aiService.embedNote(req.params.id, req.user.id);
    return sendSuccess(res, result, 201);
  },
);

export const search = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) return sendError(res, "Unauthorized", 401);

  const body = searchSchema.parse(req.body);

const results = await aiService.search(
  body.query,
  req.user.id,
  body.limit,
);

return sendSuccess(res, results);
  },
);