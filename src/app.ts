import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { v1Router } from './routes/v1Router';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        // support application/json
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // cors
        this.app.use(cors());
        // Routing
        this.app.use('/v1', v1Router);
    }
}

export default new App().app;
