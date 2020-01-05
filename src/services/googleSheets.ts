import { google, sheets_v4 as sheets } from 'googleapis';
import { JWTInput } from 'google-auth-library';

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

interface Translation {
    baseLanguageValue: string;
    translationValue: string;
}

export async function getSheetTranslations(
    spreadsheetId: string,
    range: string,
    credentials: JWTInput,
): Promise<Translation[]> {
    const sheetReader = new GoogleSheetReader(credentials.client_email, credentials.private_key, [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
    ]);
    try {
        await sheetReader.authorize();
        const result = await sheetReader.read(spreadsheetId, range);
        return result.values.map<Translation>(value => ({
            baseLanguageValue: value[0],
            translationValue: value[1],
        }));
    } catch (error) {
        console.log('failed to fetch translations from google sheet');
        throw error;
    }
}
