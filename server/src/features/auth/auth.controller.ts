import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  return res.status(200).json({
    success: true,
    data: req.user,
  });
};