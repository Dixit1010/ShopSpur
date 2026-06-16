import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  process.stderr.write(`[ERROR] ${timestamp} ${err.message}\n${err.stack}\n`);
  res.status(500).json({ error: "Something went wrong. Please try again." });
};
