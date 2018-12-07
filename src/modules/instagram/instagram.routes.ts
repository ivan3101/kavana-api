import {InstagramController} from "./instagram.controller";
import {Router} from "express";

export class InstagramRoutes {

    private readonly router: Router = Router();
    private readonly instagramController = new InstagramController();

    constructor() {
        this.initRoutes();
    }

    public get Router(): Router {
        return this.router;
    }

    private initRoutes(): void {
        this.router
            .get('/', this.instagramController.getLastPosts);
    }
}