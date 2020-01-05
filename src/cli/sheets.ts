import credentials from '../../service-account-credentials.json';
import { getSheetTranslations } from '../services/googleSheets';

getSheetTranslations('1DWe9Sl7x-6802hZldXLtIsR8UkefxpWLpJ2Z8fA4MYM', 'A2:B', credentials).then(data => {
    console.log('data is here', data);
});
