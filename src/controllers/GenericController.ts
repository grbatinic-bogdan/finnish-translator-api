import { Request, Response } from 'express';

class GenericController {
    public async root(_req: Request, res: Response): Promise<void> {
        res.status(200).send({ message: 'This is a root page' });
    }
}

export const genericController = new GenericController();
