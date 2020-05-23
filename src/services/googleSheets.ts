import { google, sheets_v4 as sheets } from 'googleapis';
import { JWTInput } from 'google-auth-library';
import { Translation } from './validationService';

class GoogleSheetReader {
    constructor(
        private clientEmail: string,
        private privateKey: string,
        private scopes: string[],
        private sheets?: sheets.Sheets,
    ) {}

    async authorize(): Promise<void> {
        const googleJwt = new google.auth.JWT({
            email: this.clientEmail,
            key: this.privateKey,
            scopes: this.scopes,
        });

        await googleJwt.authorize();
        this.sheets = google.sheets({
            version: 'v4',
            auth: googleJwt,
        });
    }

    async read(spreadsheetId: string, range: string): Promise<sheets.Schema$ValueRange> {
        const result = await this.sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        return result.data;
    }
}

export async function getSheetTranslations(
    spreadsheetId: string,
    range: string,
    credentials: JWTInput,
): Promise<sheets.Schema$ValueRange> {
    const sheetReader = new GoogleSheetReader(credentials.client_email, credentials.private_key, [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
    ]);
    try {
        await sheetReader.authorize();
        return await sheetReader.read(spreadsheetId, range);
    } catch (error) {
        console.log('failed to fetch translations from google sheet');
        throw error;
    }
}

export function formatSheetTranslations(result: sheets.Schema$ValueRange): Translation[] {
    return result.values.map<Translation>(([baseLanguageValue, translationValues]) => {
        translationValues = (translationValues as string).split(';').map(translationValue => translationValue.trim());
        return { baseLanguageValue, translationValues };
    });
}
