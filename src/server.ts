import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
import { config } from "./config/environments";
import { routes } from "./routes";
import serverless from "serverless-http";

dotenv.config();

let handler;

const app: Express = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// routes
routes(app);

app.get("/", (req: Request, res: Response) => {
  try {
    return res.status(200).send({
      status: 200,
      success: true,
      message: "Health OK! Server is running",
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      success: false,
      error: { code: 500, message: (err as Error).message },
    });
  }
});

if (config.lambda) {
  const port = config.port || 3001;

  app.listen(port, () => {
    console.log(
      `Server listening on port ${port}, url: http://localhost:${port}`,
    );
  });
} else {
  handler = serverless(app);
}

export { handler };
