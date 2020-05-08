// import credentials from '../../service-account-credentials.json';
import { getSheetTranslations } from '../services/googleSheets';

import { validateTranslations } from '../services/validationService';
import { importTranslations, RedisTranslationService } from '../services/translationImporter';
import redis from 'redis';

const serviceAccountCredentialsBuffer = Buffer.from(process.env['GOOGLE_APIS_SERVICE_ACCOUNT_CREDENTIALS'], 'base64');
const serviceAccountCredentials = JSON.parse(serviceAccountCredentialsBuffer.toString('utf-8'));

getSheetTranslations(process.env['TRANSLATIONS_GOOGLE_SHEET_ID'], 'A2:B', serviceAccountCredentials)
    .then(data => {
        if (Array.isArray(data)) {
            const validatedTranslations = validateTranslations(data);

            const redisTranslationService = new RedisTranslationService(
                redis.createClient({
                    host: process.env['REDIS_SERVER_HOST_NAME'],
                    port: (process.env['REDIS_SERVER_PORT'] as unknown) as number,
                }),
            );
            return importTranslations(validatedTranslations, redisTranslationService);
        }
    })
    .then(() => {
        process.exit();
    });
