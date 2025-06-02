import express, { Application } from "express";
import cors from "cors";

// Local Imports.
import { AdminRouter, healthCheckRouter } from "./routes";

// Initiate the application.
const app: Application = express();

// Built-in && Third-party Middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes.
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/health", healthCheckRouter);

export default app;
