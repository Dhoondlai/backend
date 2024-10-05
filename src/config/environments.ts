import "dotenv/config";

export const config = {
  port: process.env.PORT,
  lambda: process.env.LAMBDA || "false",
};
