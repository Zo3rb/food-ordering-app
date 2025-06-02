import http from "http";

// Local Imports.
import config from "./config";
import app from "./app";
import connectDB from "./utils/dbConnect";

const server = http.createServer(app);
const PORT = config.port;

server.listen(PORT, () => {
  console.clear();
  connectDB();
  console.log(`[SERVER] Application is Running on PORT: ${PORT}`);
});
