import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 400,
) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};