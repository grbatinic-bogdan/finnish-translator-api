import rewire from 'rewire';
import { Translation } from './validationService';

describe('translationImporter test suite', () => {
    /**
     * https://weekly.elfitz.com/2018/10/17/using-rewire-with-typescript-jest/
     */
    const importerModule = rewire('../../dist/src/services/translationImporter');
    const removeDuplicateTranslations = importerModule.__get__('removeDuplicateTranslations');
    describe('removal of duplicate translations', () => {
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
        const filteredTranslations: Translation[] = removeDuplicateTranslations(newTranslations, savedTranslations);

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
});
