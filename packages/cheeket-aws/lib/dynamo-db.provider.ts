import { interfaces } from "cheeket";
import * as AWS from "aws-sdk";

function dynamoDBProvider(
  configuration: AWS.DynamoDB.ClientConfiguration
): interfaces.Provider<AWS.DynamoDB> {
  return () => new AWS.DynamoDB(configuration);
}

export default dynamoDBProvider;
