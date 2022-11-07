import * as AWS from 'aws-sdk';
import { SEOUL_REGION } from 'src/constants/common';

export const updateAWSCredential = (accessKey: string, secret: string) => {
  const credential = new AWS.Credentials({
    accessKeyId: accessKey,
    secretAccessKey: secret,
  });

  AWS.config.update({
    region: SEOUL_REGION,
    credentials: credential,
  });
};
