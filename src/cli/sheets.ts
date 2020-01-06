import credentials from '../../service-account-credentials.json';
import { getSheetTranslations } from '../services/googleSheets';

import { validateTranslation } from '../services/validationService';
import { importTranslations, RedisTranslationService } from '../services/translationImporter';
import redis from 'redis';

getSheetTranslations('1DWe9Sl7x-6802hZldXLtIsR8UkefxpWLpJ2Z8fA4MYM', 'A2:B', credentials).then(data => {
    if (Array.isArray(data)) {
        // redisClient.lpush('translations', JSON.stringify(data));
        const validatedTranslations = validateTranslation([...data, { test: 1 }]);

        const redisTranslationService = new RedisTranslationService(
            redis.createClient({
                host: 'redis-server',
                port: 6379,
            }),
        );
        importTranslations(validatedTranslations, redisTranslationService);
    }
});
