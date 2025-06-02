import { Router } from "express";
import { checkHealth } from "../controllers/healthCheck.controller";

const healthCheckRouter = Router();

healthCheckRouter.get("/", checkHealth);

export default healthCheckRouter;
