import { Request, Response } from "express";

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "API is healthy and Running",
    timestamp: new Date().toISOString(),
  });
};
