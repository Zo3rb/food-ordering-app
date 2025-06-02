import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Local Imports.
import config from "../config";
import { logger } from "../utils/logger";
import ApiError from "../utils/ApiError";

const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(400, message);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value =
    err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || JSON.stringify(err.keyValue);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ApiError(400, message);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new ApiError(400, message);
};

const handleJWTError = () =>
  new ApiError(401, "Invalid token. Please log in again!");
const handleJWTExpiredError = () =>
  new ApiError(401, "Your token has expired! Please log in again.");

const sendErrorDev = (err: ApiError, req: Request, res: Response) => {
  logger.error("ERROR 💥", {
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    isOperational: err.isOperational,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      body: req.body, // Be cautious logging sensitive body data
      query: req.query,
      params: req.params,
    },
  });
  return res.status(err.statusCode).json({
    status: err.statusCode >= 500 ? "error" : "fail",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ApiError, req: Request, res: Response) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn("OPERATIONAL ERROR 🛡️", {
      // Log operational errors as warnings or info
      message: err.message,
      statusCode: err.statusCode,
      request: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      },
    });
    return res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? "error" : "fail",
      message: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  logger.error("PROGRAMMING OR UNKNOWN ERROR 💥", {
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
  });
  // 2) Send generic message
  return res.status(500).json({
    status: "error",
    message: "Something went very wrong!",
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || (err.statusCode >= 500 ? "error" : "fail");

  let error = {
    ...err,
    message: err.message,
    name: err.name,
    stack: err.stack,
  }; // Create a mutable copy

  if (config.nodeEnv === "development") {
    sendErrorDev(error as ApiError, req, res);
  } else if (config.nodeEnv === "production") {
    if (error.name === "CastError")
      error = handleCastErrorDB(error as mongoose.Error.CastError);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); // MongoDB duplicate key
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error as mongoose.Error.ValidationError);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error as ApiError, req, res);
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = `Can't find ${req.originalUrl} on this server!`;
  logger.warn(message, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });
  next(new ApiError(404, message));
};
