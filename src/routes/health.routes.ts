import { Router } from "express";
import { checkHealth } from "../controllers/healthCheck.controller";

const healthCheckRouter = Router();

healthCheckRouter.get("/health", checkHealth);

export default healthCheckRouter;
