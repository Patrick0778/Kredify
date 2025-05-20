import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import hpp from "hpp";
import { ErrorHandler } from "./controllers/error.js";
import logger from "./utils/logger.js";
import router from "./controllers/routes.js";
import { limiter } from "./utils/util.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const port = process.env.PORT;

const app = express();
const prisma = new PrismaClient();

// Set trust proxy to true
app.set("trust proxy", true);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
// Allow preflight requests for all routes
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

//Set various HTTP headers to enhance security
app.use(helmet());

// compression middleware
app.use(compression());

//Limit repeated requests to prevent abuse
app.use("/", limiter);

// Protect against HTTP Parameter Pollution attacks
app.use(hpp());

//Routes
app.use("/", router);

// Error handling middleware
app.use(ErrorHandler);

// Start the server
app.listen(port, async () => {
  logger.info(`Server running on port ${port}`);

  try {
    await prisma.$connect();
    logger.info("Connected to the database.");
  } catch (error) {
    logger.error("Database connection error:", error);
  }
});
