import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AuthPayload = {
  id: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  iat?: number;
  exp?: number;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "No token provided",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No token provided",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("JWT_SECRET is missing");
    return res.status(500).json({
      success: false,
      error: "JWT configuration is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthPayload;

    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};