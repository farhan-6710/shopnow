//src/middlewares/errorHandler.ts

import type { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction // Express only treats a four-argument middleware as an error handler.
) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
