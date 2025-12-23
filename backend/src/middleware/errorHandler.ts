import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    statusCode: status,
    message: err.message || "Server error"
  });
};
