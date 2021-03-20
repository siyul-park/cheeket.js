import { interfaces } from "cheeket";
import * as AWS from "aws-sdk";

function s3Provider(
  configuration: AWS.S3.ClientConfiguration
): interfaces.Provider<AWS.S3> {
  return () => {
    return new AWS.S3(configuration);
  };
}

export default s3Provider;
