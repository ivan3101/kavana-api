import {Application} from "express";
import express = require("express");
import helmet = require("helmet");
import cors = require("cors");
import bodyParser = require("body-parser");
import morgan = require("morgan");
import {connection} from "mongoose";
import {Server as HttpServer} from "http";
import {ErrorService} from "./services/errorService";
import {InstagramRoutes} from "./modules/instagram/instagram.routes";
import {MessageRoutes} from "./modules/message/message.routes";
import {AuthRoutes} from "./modules/auth/auth.routes";
import session = require("express-session");
import {variables} from "./config/globals";

export class Server {

    public static closeConnection(server: HttpServer): void {
        server.close(() => {
            connection.close(true, () => {
                process.exit(0);
            })
        })
    }

    private readonly app = express();
    private readonly errorService = new ErrorService();

    public constructor() {
        this.initConfig();
        this.initRoutes();
        this.initErrorHandlers();
    }

    public get App(): Application {
        return this.app;
    }

    private initConfig(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(morgan('dev'));
        // this.app.use(session({
        //     secret: variables.secret,
        //     resave: false,
        //     saveUninitialized: false,
        //     cookie: {
        //         expires: 6000
        //     }
        // }))
    }

    private initRoutes(): void {
        this.app
            .use('/api/auth', new AuthRoutes().Router)
            .use('/api/instagram', new InstagramRoutes().Router)
            .use('/api/messages', new MessageRoutes().Router)
    }

    private initErrorHandlers(): void {
        this.app
            .use(this.errorService.boomErrorHandler())
            .use(this.errorService.errorHandler());
    }
}
