import {Router} from "express";
import {MessageController} from "./message.controller";

export class MessageRoutes {
    private readonly router: Router = Router();
    private readonly messageController = new MessageController();

    constructor() {
        this.initRoutes();
    }

    public get Router(): Router {
        return this.router;
    }

    private initRoutes() {
        this.router
            .get('/', this.messageController.getMessages)

            .post('/', this.messageController.addMessage)
    }
}