import { Translation } from './validationService';
import { _removeDuplicateTranslations } from './translationImporter';
import { TranslationService } from './TranslationService';
import { dynamoDbClient, dynamoDbDocumentClient } from './dynamodb';

describe('duplicate translation filtering test suite', () => {
    describe('new translations are not filtered', () => {
        const savedTranslations: Translation[] = [
            {
                baseLanguageValue: 'window',
                translationValues: ['ikkuna'],
            },
            {
                baseLanguageValue: 'door',
                translationValues: ['ovi'],
            },
        ];
        const newTranslation: Translation = {
            baseLanguageValue: 'chair',
            translationValues: ['tuoli'],
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
            expect(filteredTranslations[0].translationValues.length).toEqual(newTranslation.translationValues.length);
        });
    });

    describe('duplicate translations are removed', () => {
        const savedTranslations: Translation[] = [
            {
                baseLanguageValue: 'window',
                translationValues: ['ikkuna'],
            },
            {
                baseLanguageValue: 'door',
                translationValues: ['ovi'],
            },
        ];
        const newTranslations: Translation[] = [
            ...savedTranslations,
            {
                baseLanguageValue: 'new',
                translationValues: ['uusi'],
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
            expect(filteredTranslations[0].translationValues).toBe(newTranslations[2].translationValues);
        });
    });
});

describe('translation import test suite', () => {
    const translationService = new TranslationService(dynamoDbClient, dynamoDbDocumentClient);

    // database setup
    beforeEach(async () => {
        const hasTranslationsTable = await translationService.hasTranslationTable();
        if (!hasTranslationsTable) {
            await translationService.createTranslationTable();
        }
    });

    afterEach(async () => {
        const { Count: translationCount } = await translationService.fetchTranslations();

        if (translationCount > 0) {
            await dynamoDbClient
                .deleteTable({
                    TableName: translationService.getTranslationKey(),
                })
                .promise();
        }
    });

    describe('translation service test suite', () => {
        describe('fetch translations test suite', () => {
            let translations: Translation[];
            beforeEach(async () => {
                const { Items } = await translationService.fetchTranslations();
                translations = Items as Translation[];
            });

            it('should assert that there is no saved translations', () => {
                expect(translations.length).toEqual(0);
            });
        });

        describe('add translations test suite', () => {
            const newTranslations: Translation[] = [
                {
                    baseLanguageValue: 'window',
                    translationValues: ['ikkuna'],
                },
                {
                    baseLanguageValue: 'door',
                    translationValues: ['ovi'],
                },
            ];
            let savedTranslations: Translation[];

            beforeEach(async () => {
                await translationService.addTranslations(newTranslations);

                const { Items } = await translationService.fetchTranslations();
                savedTranslations = Items as Translation[];
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
