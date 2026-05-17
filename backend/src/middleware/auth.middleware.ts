import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../models/User";
import { ApiError } from "../utils/ApiError";

interface AuthPayload extends JwtPayload {
  id: string;
  role: Role;
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) return next(new ApiError(401, "Authentication token is required"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as AuthPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new ApiError(401, "Authentication required"));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, "Insufficient permissions"));
    next();
  };
