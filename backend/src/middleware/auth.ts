import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { fail } from "../utils/errorResponse";

export interface AuthRequest extends Request {
  userId?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(fail(401, "Missing or invalid Authorization header"));
    }

    // Safer than split; handles extra spaces
    const token = header.slice(7).trim();

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json(fail(401, "Invalid or expired token"));
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json(fail(401, "Authentication failed"));
  }
};

export const authMiddleware = auth;

export const optionalAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const token = header.slice(7).trim();
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        req.userId = decoded.id;
      }
    }
    next();
  } catch {
    next();
  }
};
