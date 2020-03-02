import { Translation } from './validationService';
import { _removeDuplicateTranslations, RedisTranslationService } from './translationImporter';
import redis from 'redis';

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
    describe('redis client test suite', () => {
        let redisTranslationService: RedisTranslationService;
        beforeEach(() => {
            redisTranslationService = new RedisTranslationService(
                redis.createClient({
                    host: process.env['REDIS_SERVER_HOST_NAME'],
                    port: (process.env['REDIS_SERVER_PORT'] as unknown) as number,
                }),
            );
        });

        describe('fetch translations test suite', () => {
            let translations: Translation[];
            beforeEach(async () => {
                translations = await redisTranslationService.fetchTranslations();
            });

            it('should assert that there is no saved translations', () => {
                expect(translations.length).toEqual(0);
            });
        });

        //it('should assert that there is no translations saved', () => {});
    });
});
