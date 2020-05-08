import { Request, Response } from 'express';
import { RedisTranslationService } from '../services/translationImporter';
import redis from 'redis';
// import { getRandomInt } from '../services/utils';

class TranslationController {
    constructor(private redisTranslationService?: RedisTranslationService) {}

    public async root(_req: Request, res: Response): Promise<void> {
        try {
            /*
            const result = await this.redisTranslationService.fetchTranslations();
            res.status(200).send(result);
            */
            res.status(200).send({});
        } catch (error) {
            res.status(500).send();
        }
    }

    public async randomTranslation(_req: Request, res: Response): Promise<void> {
        try {
            /*
            const translations = await this.redisTranslationService.fetchTranslations();
            const randomIndex = getRandomInt(0, translations.length - 1);
            res.status(200).send(translations[randomIndex]);
            */
            res.status(200).send({});
        } catch (error) {
            res.status(500).send();
        }
    }
}

export const translationController = new TranslationController();
/*
    new RedisTranslationService(
        redis.createClient({
            host: process.env['REDIS_SERVER_HOST_NAME'],
            port: (process.env['REDIS_SERVER_PORT'] as unknown) as number,
        }),
    ),
    */
