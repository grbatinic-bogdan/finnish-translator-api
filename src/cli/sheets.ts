import credentials from '../../service-account-credentials.json';
import { getSheetTranslations } from '../services/googleSheets';

import { validateTranslations } from '../services/validationService';
import { importTranslations, RedisTranslationService } from '../services/translationImporter';
import redis from 'redis';

getSheetTranslations(process.env['TRANSLATIONS_GOOGLE_SHEET_ID'], 'A2:B', credentials)
    .then(data => {
        if (Array.isArray(data)) {
            const validatedTranslations = validateTranslations(data);

            const redisTranslationService = new RedisTranslationService(
                redis.createClient({
                    host: 'redis-server',
                    port: 6379,
                }),
            );
            return importTranslations(validatedTranslations, redisTranslationService);
        }
    })
    .then(() => {
        process.exit();
    });
