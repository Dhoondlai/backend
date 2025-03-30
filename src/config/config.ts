import { Config, initConfig } from "./environments"; // Import the Config type

let config: Config | undefined; // Declare config with the type Config

// Load the configuration asynchronously
export const loadConfig = async (): Promise<void> => {
  // Initialize the configuration using your async initConfig function
  config = await initConfig(); // Wait for initConfig to finish before proceeding
};

// Get the configuration, throwing an error if not loaded yet
export const getConfig = (): Config => {
  if (!config) throw new Error("Config has not been loaded yet.");
  return config;
};
