import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, email, password, role } = req.body as Record<string, string>;
  if (!name || name.trim().length < 2) return next(new ApiError(400, "Name must be at least 2 characters"));
  if (!emailRegex.test(email || "")) return next(new ApiError(400, "Valid email is required"));
  if (!password || password.length < 6) return next(new ApiError(400, "Password must be at least 6 characters"));
  if (role && !["admin", "sales"].includes(role)) return next(new ApiError(400, "Invalid role"));
  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction): void => {
  const { email, password } = req.body as Record<string, string>;
  if (!emailRegex.test(email || "") || !password) return next(new ApiError(400, "Email and password are required"));
  next();
};

export const validateLead = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, email, status, source } = req.body as Record<string, string>;
  if (name !== undefined && name.trim().length < 2) return next(new ApiError(400, "Name must be at least 2 characters"));
  if (email !== undefined && !emailRegex.test(email)) return next(new ApiError(400, "Valid email is required"));
  if (status !== undefined && !["New", "Contacted", "Qualified", "Lost"].includes(status)) return next(new ApiError(400, "Invalid status"));
  if (source !== undefined && !["Website", "Instagram", "Referral"].includes(source)) return next(new ApiError(400, "Invalid source"));
  next();
};
