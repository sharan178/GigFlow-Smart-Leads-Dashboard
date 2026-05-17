import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};
