import winston from "winston";

// Local Imports.
import config from "../config";

const { combine, timestamp, printf, colorize, align, json } = winston.format;

const fileRotateTransport = new winston.transports.File({
  filename: "logs/app-error.log",
  level: "error",
  maxsize: 5242880,
  maxFiles: 5,
});

const consoleTransport = new winston.transports.Console({
  level: config.nodeEnv === "development" ? "debug" : "info",
  format: combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    align(),
    printf(
      (info) =>
        `[${info.timestamp}] ${info.level}: ${info.message} ${
          info.stack ? `\n${info.stack}` : ""
        }`
    )
  ),
});

const logger = winston.createLogger({
  level: config.nodeEnv === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    json(), // Log in JSON format to files for easier parsing
    printf((info) => {
      const log = {
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
        service: "food-ordering-app", // Add service name
        stack: info.stack,
        // You can add more context here if needed
      };
      return JSON.stringify(log);
    })
  ),
  transports: [
    consoleTransport,
    new winston.transports.File({
      filename: "logs/app-combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    // Handle uncaught exceptions
    new winston.transports.File({ filename: "logs/app-exceptions.log" }),
  ],
  rejectionHandlers: [
    // Handle unhandled promise rejections
    new winston.transports.File({ filename: "logs/app-rejections.log" }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

if (config.nodeEnv !== "test") {
  logger.add(fileRotateTransport);
}

const stream = {
  write: (message: string) => {
    // Morgan output includes a newline character, remove it
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { logger, stream as morganStream };
