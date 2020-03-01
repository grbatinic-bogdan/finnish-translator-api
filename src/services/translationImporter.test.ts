import { Translation } from './validationService';
import { _removeDuplicateTranslations } from './translationImporter';

describe('translationImporter test suite', () => {
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
