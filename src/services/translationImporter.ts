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

    getTranslationKey(): string {
        return this.translationKey;
    }
}

export function _removeDuplicateTranslations(
    translations: Translation[],
    savedTranslations: Translation[],
): Translation[] {
    if (savedTranslations.length > 0) {
        const duplicateTranslations = translations.filter(importTranslation => {
            const isFound = savedTranslations.find(
                savedTranslations => savedTranslations.baseLanguageValue === importTranslation.baseLanguageValue,
            );

            return !!isFound;
        });
        if (duplicateTranslations.length > 0) {
            translations = translations.filter(importTranslation => {
                const foundDuplicate = duplicateTranslations.find(duplicateTranslation => {
                    return duplicateTranslation.baseLanguageValue === importTranslation.baseLanguageValue;
                });

                return !!foundDuplicate === false;
            });
        }
    }

    return translations;
}

export async function importTranslations(
    translations: Translation[],
    redisTranslationService: RedisTranslationService,
): Promise<void> {
    const savedTranslations = await redisTranslationService.fetchTranslations();
    const translationsToImport = _removeDuplicateTranslations(translations, savedTranslations);

    redisTranslationService.addTranslations(translationsToImport);
}
