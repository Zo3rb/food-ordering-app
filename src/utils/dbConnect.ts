import mongoose from "mongoose";
import config from "../config";

export default async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log(`[DATABASE] Connection Successfully Established`);
  } catch (err) {
    console.error("[DATABASE] Connection Error:", err);
    process.exit(1);
  }
};
