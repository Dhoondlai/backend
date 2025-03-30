import * as mongoDB from "mongodb";
import { getConfig } from "./config";
import { logger } from "../libs/logger";

export async function connectToDatabase() {
  try {
    const config = getConfig();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
      config.DB_CONN_STRING,
    );
    await client.connect();
    const db: mongoDB.Db = client.db(`dhoondlai`);
    const productsCollection: mongoDB.Collection = db.collection("products");

    collections.products = productsCollection;
    logger.info("Connected to database");
  } catch (e) {
    logger.error(`Error connecting to database: ${(e as Error).message}`);
  }
}

export const collections: {
  products?: mongoDB.Collection;
} = {};
