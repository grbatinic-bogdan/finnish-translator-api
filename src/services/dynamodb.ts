import aws, { DynamoDB } from 'aws-sdk';
import { ENVIRONMENT } from './types';

let dynamoDbDocumentClient: DynamoDB.DocumentClient;
let dynamoDbClient: DynamoDB;

try {
    const environment = process.env['NODE_ENV'] as ENVIRONMENT;
    const connectionOptions: DynamoDB.Types.ClientConfiguration =
        environment !== 'prod'
            ? {
                  endpoint: process.env['AWS_ENDPOINT'],
              }
            : {};

    dynamoDbClient = new DynamoDB(connectionOptions);
    dynamoDbDocumentClient = new aws.DynamoDB.DocumentClient(connectionOptions);
} catch (error) {
    console.log('Could not connect');
    throw error;
}

export { dynamoDbClient, dynamoDbDocumentClient };
