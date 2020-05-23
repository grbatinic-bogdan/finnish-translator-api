import { Translation } from './validationService';
import { TranslationService } from './TranslationService';

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

export async function importTranslations(translations: Translation[], translationService: TranslationService) {
    let translationsToImport = translations;
    const hasTranslationTable = await translationService.hasTranslationTable();
    if (hasTranslationTable) {
        const { Items: savedTranslations } = await translationService.fetchTranslations();
        translationsToImport = _removeDuplicateTranslations(translations, savedTranslations as Translation[]);
    } else {
        await translationService.createTranslationTable();
    }

    return await translationService.addTranslations(translationsToImport);
}
