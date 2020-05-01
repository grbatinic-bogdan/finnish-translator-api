import { Translation } from './validationService';
import { _removeDuplicateTranslations, RedisTranslationService } from './translationImporter';
import redis from 'redis';
import { promisify } from 'util';

describe('duplicate translation filtering test suite', () => {
    describe('new translations are not filtered', () => {
        const savedTranslations: Translation[] = [
            {
                baseLanguageValue: 'window',
                translationValue: 'ikkuna',
            },
            {
                baseLanguageValue: 'door',
                translationValue: 'ovi',
            },
        ];
        const newTranslation: Translation = {
            baseLanguageValue: 'chair',
            translationValue: 'tuoli',
        };
        const newTranslations: Translation[] = [...savedTranslations, newTranslation];
        const filteredTranslations: Translation[] = _removeDuplicateTranslations(newTranslations, savedTranslations);

        it('should assert that array is 1', () => {
            expect(filteredTranslations.length).toBe(1);
        });

        it('should assert that base language value value of filtered translation matches to new translation', () => {
            expect(filteredTranslations[0].baseLanguageValue).toBe(newTranslation.baseLanguageValue);
        });

        it('should assert that translation value of filtered translation matches to new translation', () => {
            expect(filteredTranslations[0].translationValue).toBe(newTranslation.translationValue);
        });
    });

    describe('duplicate translations are removed', () => {
        const savedTranslations: Translation[] = [
            {
                baseLanguageValue: 'window',
                translationValue: 'ikkuna',
            },
            {
                baseLanguageValue: 'door',
                translationValue: 'ovi',
            },
        ];
        const newTranslations: Translation[] = [
            ...savedTranslations,
            {
                baseLanguageValue: 'new',
                translationValue: 'uusi',
            },
        ];
        const filteredTranslations: Translation[] = _removeDuplicateTranslations(newTranslations, savedTranslations);
        it('should assert that filtered has 2 members', () => {
            expect(filteredTranslations.length).toBe(1);
        });

        it('should assert that base language value value of filtered translation matches to new translation', () => {
            expect(filteredTranslations[0].baseLanguageValue).toBe(newTranslations[2].baseLanguageValue);
        });

        it('should assert that translation value of filtered translation matches to new translation', () => {
            expect(filteredTranslations[0].translationValue).toBe(newTranslations[2].translationValue);
        });
    });
});

describe('translation import test suite', () => {
    const redisClient = redis.createClient({
        host: process.env['REDIS_SERVER_HOST_NAME'],
        port: (process.env['REDIS_SERVER_PORT'] as unknown) as number,
    });
    const redisTranslationService = new RedisTranslationService(redisClient);

    // database setup
    beforeEach(async () => {
        const hasTranslations = await redisTranslationService.fetchTranslations();
        const asyncDeleteKey = promisify(redisClient.del).bind(redisClient);
        if (hasTranslations.length > 0) {
            await asyncDeleteKey(redisTranslationService.getTranslationKey());
        }
    });

    describe('redis client test suite', () => {
        describe('fetch translations test suite', () => {
            let translations: Translation[];
            beforeEach(async () => {
                translations = await redisTranslationService.fetchTranslations();
            });

            it('should assert that there is no saved translations', () => {
                expect(translations.length).toEqual(0);
            });
        });

        describe('add translations test suite', () => {
            const newTranslations: Translation[] = [
                {
                    baseLanguageValue: 'window',
                    translationValue: 'ikkuna',
                },
                {
                    baseLanguageValue: 'door',
                    translationValue: 'ovi',
                },
            ];
            let savedTranslations: Translation[];

            beforeEach(async () => {
                await redisTranslationService.addTranslations(newTranslations);
                savedTranslations = await redisTranslationService.fetchTranslations();
            });

            it('should assert that translations are imported', () => {
                expect(savedTranslations.length).toBeGreaterThan(0);
            });

            it('should assert that all the translations have been saved', () => {
                expect(savedTranslations.length).toEqual(newTranslations.length);
            });
        });
    });
});
