import { Request, Response } from 'express';

export class MainController {
    public root(_req: Request, res: Response): void {
        res.status(200).send({
            message: 'Hello from root route',
        });
    }
}

export const mainController = new MainController();
