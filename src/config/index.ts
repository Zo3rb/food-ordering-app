import dotenv from "dotenv";

// Load the Environment Vars from .env file.
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoURI: process.env.MONGO_URI || "",
};

// Validate essential configurations
if (!config.mongoURI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1); // Exit the application if critical configurations are missing
}

export default config;
