import { z } from "zod";

export const createSessionSchema = z.object({
  resourceId: z.string().uuid().optional(),
});

export const updateSessionSchema = z.object({
  status: z.enum(["COMPLETED", "CANCELLED"]),
});