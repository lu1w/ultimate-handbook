/**
 * this file is the entry point of the application.
 * It connects to the MongoDB database and starts the express server.
 *  It also sets up the error handling for the application.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const { connectMongoClient } = require("./config/mongoClient");
let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});

//connect to MongoDB
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
  const client = await connectMongoClient();
  await client.close();
  logger.info("MongoClient closed");
  process.exit(0);
});
