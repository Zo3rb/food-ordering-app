import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

// Local Imports.
import config from "./config";
import { logger, morganStream } from "./utils/logger";
import { globalErrorHandler, notFoundHandler } from "./middleware/errorHandler";
import ApiError from "./utils/ApiError";

import { AdminRouter, healthCheckRouter } from "./routes";

// Initiate the application.
const app: Application = express();

// Built-in && Third-party Middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== "test") {
  app.use(morgan("dev", { stream: morganStream }));
}

// Mount Routes.
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/health", healthCheckRouter);

// Error Handlers.
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
