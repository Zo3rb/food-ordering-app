import { Request, Response, NextFunction } from "express";

// Local Imports
import catchAsync from "../middleware/catchAsync";

export const createVendor = catchAsync(async (req: Request, res: Response) => {
  res.status(201).json({
    status: "success",
    data: {
      message: "to be implemented",
    },
  });
});

export const getVendors = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "to be implemented",
    },
  });
});

export const getVendorById = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "to be implemented",
      id: req.params.id,
    },
  });
});
