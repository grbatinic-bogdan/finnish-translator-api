import express from 'express';
import { translationController } from '../controllers/TranslationController';

class V1Router {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {
        this.router.get('/translations', (req: express.Request, res: express.Response) =>
            translationController.root(req, res),
        );
    }
}

export const v1Router = new V1Router().router;
