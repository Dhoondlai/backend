import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { logger } from "./logger";

const ssmClient = new SSMClient({ region: "us-east-1" });

export const getSecret = async (
  secretName: string,
): Promise<string | undefined> => {
  const params = {
    Name: secretName,
    WithDecryption: true,
  };

  try {
    const command = new GetParameterCommand(params);
    const response = await ssmClient.send(command);
    return response.Parameter?.Value;
  } catch (error) {
    logger.error(
      `Error fetching secret ${secretName}: ${(error as Error).message}`,
    );
    return undefined;
  }
};
