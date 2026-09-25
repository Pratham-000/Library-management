import { Request, Response } from "express";
import * as authRepository from "./auth.repository";

export const getUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
  return res.status(200).json({ success: true, data: req.user });
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (name.length < 2 || name.length > 80) {
    return res.status(400).json({ success: false, error: "Name must be between 2 and 80 characters." });
  }

  const user = await authRepository.updateUserName(req.user.id, name);
  return res.status(200).json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};
