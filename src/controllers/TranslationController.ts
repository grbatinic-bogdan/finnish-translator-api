import { Request, Response } from 'express';
import { dynamoDbDocumentClient, dynamoDbClient } from '../services/dynamodb';
import { TranslationService } from '../services/TranslationService';
import { random } from 'lodash';

class TranslationController {
    constructor(private translationService: TranslationService) {}

    public async root(_req: Request, res: Response): Promise<void> {
        try {
            const translations = await this.translationService.fetchTranslations();

            res.status(200).send(translations.Items);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    }

    public async randomTranslation(_req: Request, res: Response): Promise<void> {
        try {
            const { Items: translations } = await this.translationService.fetchTranslations();

            const randomIndex = random(0, translations.length - 1);
            res.status(200).send(translations[randomIndex]);
        } catch (error) {
            res.status(500).send();
        }
    }
}

export const translationController = new TranslationController(
    new TranslationService(dynamoDbClient, dynamoDbDocumentClient),
);
