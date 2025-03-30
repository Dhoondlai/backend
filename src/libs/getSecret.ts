import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

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
    console.error(`Error fetching secret "${secretName}":`, error);
    return undefined;
  }
};
