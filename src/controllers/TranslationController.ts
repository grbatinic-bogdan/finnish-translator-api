import { Request, Response } from 'express';
import { RedisTranslationService } from '../services/translationImporter';
import redis from 'redis';

class TranslationController {
    constructor(private redisTranslationService: RedisTranslationService) {}

    public async root(_req: Request, res: Response): Promise<void> {
        try {
            const result = await this.redisTranslationService.fetchTranslations();
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send();
        }
    }
}

export const translationController = new TranslationController(
    new RedisTranslationService(
        redis.createClient({
            host: process.env['REDIS_SERVER_HOST_NAME'],
            port: (process.env['6379'] as unknown) as number,
        }),
    ),
);
