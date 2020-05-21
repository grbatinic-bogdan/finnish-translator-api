import aws from 'aws-sdk';
import { Translation } from './validationService';

export class TranslationService {
    constructor(
        private databaseClient: aws.DynamoDB,
        private documentClient: aws.DynamoDB.DocumentClient,
        private tableName: string = 'translations',
    ) {}

    async addTranslations(translations: Translation[]) {
        const importPromises = translations.map(translation =>
            this.documentClient
                .put({
                    TableName: this.tableName,
                    Item: translation,
                })
                .promise(),
        );

        return await Promise.all(importPromises);
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
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
            })
            .promise();

        return createdTable.$response;
    }
}
