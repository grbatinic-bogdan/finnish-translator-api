import aws from 'aws-sdk';
import { Translation } from './validationService';
import DynamoDB, { DocumentClient, WriteRequest } from 'aws-sdk/clients/dynamodb';

export class TranslationService {
    constructor(
        private databaseClient: aws.DynamoDB,
        private documentClient: aws.DynamoDB.DocumentClient,
        private tableName: string = 'translations',
    ) {}

    async addTranslations(translations: Translation[]) {
        const numberOfItemsPerBatch = 25;
        const numberOfWrites = Math.ceil(translations.length / numberOfItemsPerBatch);
        const batches: Array<WriteRequest[]> = [];
        for (let i = 0; i < numberOfWrites; i++) {
            batches.push([]);
        }

        for (let i = 0; i < translations.length; i++) {
            const translation = translations[i];
            const batchIndex = Math.floor(i / numberOfItemsPerBatch);
            batches[batchIndex].push({
                PutRequest: {
                    Item: {
                        baseLanguageValue: {
                            S: translation.baseLanguageValue,
                        },
                        translationValues: {
                            SS: translation.translationValues,
                        },
                    },
                },
            });
        }

        const batchWrites = batches.map(batch => {
            return this.databaseClient
                .batchWriteItem({
                    RequestItems: {
                        [this.tableName]: batch,
                    },
                })
                .promise();
        });

        return await Promise.all(batchWrites);
    }

    async fetchTranslations() {
        return await this.documentClient.scan({ TableName: this.tableName }).promise();
    }

    getTranslationKey(): string {
        return this.tableName;
    }

    async hasTranslationTable() {
        const tables = await this.databaseClient.listTables().promise();
        return tables.TableNames.includes(this.tableName);
    }

    async createTranslationTable() {
        const createdTable = await this.databaseClient
            .createTable({
                AttributeDefinitions: [
                    {
                        AttributeName: 'baseLanguageValue',
                        AttributeType: 'S',
                    },
                ],
                TableName: this.tableName,
                KeySchema: [
                    {
                        AttributeName: 'baseLanguageValue',
                        KeyType: 'HASH',
                    },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                },
            })
            .promise();

        return createdTable.$response;
    }
}
