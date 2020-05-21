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

getSheetTranslations(process.env['TRANSLATIONS_GOOGLE_SHEET_ID'], 'A2:B', serviceAccountCredentials)
    .then(data => {
        const sheetTranslations = formatSheetTranslations(data);
        if (!Array.isArray(sheetTranslations)) {
            process.exit();
        }
        const validatedTranslations = validateTranslations(sheetTranslations);

        const translationService = new TranslationService(dynamoDbClient, dynamoDbDocumentClient);
        return importTranslations(validatedTranslations, translationService);
    })
    .then(result => {
        console.log(`Imported ${result.length} new translations`);
        process.exit();
    })
    .catch(error => {
        console.log(error);
        process.exit();
    });
