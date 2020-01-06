import { Translation } from './validationService';
import redis from 'redis';
import { promisify } from 'util';

export class RedisTranslationService {
    constructor(private client: redis.RedisClient, private translationKey: string = 'translations') {}

    addTranslations(translations: Translation[]): void {
        for (let i = 0; i < translations.length; i++) {
            const translation = translations[i];
            this.client.lpush(this.translationKey, JSON.stringify(translation));
        }
    }

    async fetchTranslations(): Promise<Translation[]> {
        const asynclrange = promisify(this.client.lrange).bind(this.client);
        try {
            const redisTranslations: string[] = await asynclrange(this.translationKey, 0, -1);
            return redisTranslations.map(jsonTranslations => JSON.parse(jsonTranslations));
        } catch (error) {
            throw new Error('Could not fetch translations');
        }
    }
}

export async function importTranslations(
    translations: Translation[],
    redisTranslationService: RedisTranslationService,
): Promise<void> {
    // validate input data
    console.log(translations);

    redisTranslationService.addTranslations(translations);
}
