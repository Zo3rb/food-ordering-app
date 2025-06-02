import express, { Application, Request, Response } from "express";
import cors from "cors";

// Initiate the application.
const app: Application = express();

// Built-in && Third-party Middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes.
app.get("/", (req: Request, res: Response) => {
  res.send("Food Ordering App API is Running!");
});

export default app;
