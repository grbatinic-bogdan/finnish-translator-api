import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';

export const TTranslation = t.type({
    baseLanguageValue: t.string,
    translationValue: t.string,
});

export type Translation = t.TypeOf<typeof TTranslation>;

export function validateTranslations(translations: unknown[]): Translation[] {
    return translations
        .map(translation => TTranslation.decode(translation))
        .filter(eitherValue => isRight(eitherValue))
        .map(rightTranslation => isRight(rightTranslation) && rightTranslation.right);
}
