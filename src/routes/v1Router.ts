import express from 'express';
import { translationController } from '../controllers/TranslationController';
import { genericController } from '../controllers/GenericController';

class V1Router {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {
        this.router.get('/translations', (req: express.Request, res: express.Response) =>
            translationController.root(req, res),
        );
        this.router.get('/random-translation', (req: express.Request, res: express.Response) =>
            translationController.randomTranslation(req, res),
        );
        this.router.get('/', (req: express.Request, res: express.Response) => genericController.root(req, res));
    }
}

export const v1Router = new V1Router().router;
