// import credentials from '../../service-account-credentials.json';
import { getSheetTranslations, formatSheetTranslations } from '../services/googleSheets';

import { validateTranslations } from '../services/validationService';
import { importTranslations } from '../services/translationImporter';
import { TranslationService } from '../services/TranslationService';
import { dynamoDbClient, dynamoDbDocumentClient } from '../services/dynamodb';

const serviceAccountCredentialsBuffer = Buffer.from(
    process.env['GOOGLE_APIS_SERVICE_ACCOUNT_CREDENTIALS_BASE_64'],
    'base64',
);
const serviceAccountCredentials = JSON.parse(serviceAccountCredentialsBuffer.toString('utf-8'));

const translationService = new TranslationService(dynamoDbClient, dynamoDbDocumentClient);

getSheetTranslations(process.env['TRANSLATIONS_GOOGLE_SHEET_ID'], 'A2:B', serviceAccountCredentials)
    .then(data => {
        const sheetTranslations = formatSheetTranslations(data);
        if (!Array.isArray(sheetTranslations)) {
            process.exit();
        }
        const validatedTranslations = validateTranslations(sheetTranslations);

        return importTranslations(validatedTranslations, translationService);
    })
    .then(results => {
        const numberOfUnprocessedItems = results.reduce((acc, result) => {
            return (acc += result.UnprocessedItems[translationService.getTranslationKey()].length);
        }, 0);
        console.log(`Failed to import ${numberOfUnprocessedItems} new translations`);
        process.exit();
    })
    .catch(error => {
        console.log(error);
        process.exit();
    });
