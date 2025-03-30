import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { logger } from "./libs/logger";
import morgan from "morgan";
import { routes } from "./routes";
import serverless from "serverless-http";
import { connectToDatabase } from "./config/db";
import { loadConfig } from "./config/config";
dotenv.config();

// Initialize the app
const app = express();

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
morgan.token("host", (req) => req.headers.host || "");
app.use(
  morgan(":method :host :status :res[content-length] - :response-time ms"),
);

// Health check endpoint
app.get("/api/", async (req: Request, res: Response) => {
  try {
    logger.info("HEALTH -> GET_HEALTH = Health OK! Server is running");
    return res.status(200).send({
      status: 200,
      success: true,
      message: "Health OK! Server is running",
    });
  } catch (err) {
    logger.error(`HEALTH -> GET_HEALTH = ${(err as Error).message}`);
    return res.status(500).send({
      status: 500,
      success: false,
      error: { code: 500, message: (err as Error).message },
    });
  }
});

let isInitialized = false;

// Initialization function
const initialize = async () => {
  try {
    if (!isInitialized) {
      logger.info("Initializing server...");
      await loadConfig();
      await connectToDatabase();
      logger.info("Server initialized successfully.");
      isInitialized = true;
    }
  } catch (error) {
    logger.error(
      `Error during server initialization: ${(error as Error).message}`,
    );
    console.log("Error during server initialization:");
    process.exit(1); // Terminate if initialization fails
  }
};

// Load application routes
routes(app);

// Modify the handler
const handler = async (event: any, context: any) => {
  if (!isInitialized) await initialize(); // Ensure initialization happens only once
  const serverlessHandler = serverless(app); // Generate the serverless handler
  return serverlessHandler(event, context);
};

export { handler };
