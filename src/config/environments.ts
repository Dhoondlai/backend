import "dotenv/config";
import { getSecret } from "../libs/getSecret";
import { logger } from "../libs/logger";

// For local development, ensure a .env file exists with the required environment variables.
let DB_CONN_STRING = process.env.DB_CONN_STRING || "";
let ENVIRONMENT = process.env.ENVIRONMENT || "local";
const PORT = process.env.PORT || 3001;

// Fetch secrets based on environment and Lambda settings
const fetchSecrets = async () => {
  logger.info(
    `Fetching secrets for environment: ${ENVIRONMENT} and DB_CONN_STRING: ${DB_CONN_STRING}`,
  );
  DB_CONN_STRING =
    (await getSecret(`/${ENVIRONMENT}/mongodb/conn-string`)) || DB_CONN_STRING;
};

// Initialize the secrets and then export the config
export const initConfig = async () => {
  if (ENVIRONMENT != "local") {
    await fetchSecrets();
  }

  return {
    port: PORT,
    DB_CONN_STRING: DB_CONN_STRING,
    ENVIRONMENT: ENVIRONMENT,
  };
};

export type Config = {
  port: number | string;
  DB_CONN_STRING: string;
  ENVIRONMENT: string;
};
