import { Router } from "express";

// Local Imports.
import { createVendor, getVendors, getVendorById } from "../controllers";

const AdminRouter = Router();

AdminRouter.route("/vendors").get(getVendors).post(createVendor);
AdminRouter.route("/vendors/:id").get(getVendorById);

export default AdminRouter;
