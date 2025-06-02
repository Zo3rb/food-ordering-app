import { Request, Response } from "express";

export const createVendor = async (req: Request, res: Response) => {
  try {
    res.status(201).json({
      status: "success",
      data: {
        message: "to be implemented",
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const getVendors = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        message: "to be implemented",
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        message: "to be implemented",
        id: req.params.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
