import http from "http";
import app from "./app";

// Local Imports.
import config from "./config";

const server = http.createServer(app);
const PORT = config.port;

server.listen(PORT, () => {
  console.clear();
  console.log(`[SERVER] Application is Running on PORT: ${PORT}`);
});
