import express from 'express';
import { translationController } from '../controllers/TranslationController';

class TranslationRoutes {
    public router: express.Router = express.Router();

    constructor() {
        this.config();
    }

    private config(): void {
        this.router.get('/', (req: express.Request, res: express.Response) => translationController.root(req, res));
    }
}

export const translationRoutes = new TranslationRoutes().router;
