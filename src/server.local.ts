import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; // <-- 🔹 Import cors
import { loadConfig, getConfig } from "./config/config";
import { logger } from "./libs/logger";
import morgan from "morgan";
import { routes } from "./routes";
import { connectToDatabase } from "./config/db";

dotenv.config();

// Initialize the app
const app: Express = express();

// 🔹 Use CORS middleware
app.use(cors());

// Middleware and routes
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
morgan.token("host", (req) => req.headers.host || "");
app.use(
  morgan(":method :host :status :res[content-length] - :response-time ms"),
);

// Define the routes
routes(app);

app.get("/api/", (req: Request, res: Response) => {
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

// Async function to initialize the server after loading configuration
const initializeServer = async () => {
  try {
    await loadConfig();
    const config = getConfig();
    await connectToDatabase();

    const port = config.port || 3001;
    app.listen(port, () => {
      logger.info(
        `Server listening on port ${port}, url: http://localhost:${port}`,
      );
    });
  } catch (error) {
    logger.error(
      `Error during server initialization: ${(error as Error).message}`,
    );
    process.exit(1);
  }
};

initializeServer();
