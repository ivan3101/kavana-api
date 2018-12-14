import {Router} from "express";
import {AuthController} from "./auth.controller";

export class AuthRoutes {
    private readonly router: Router = Router();
    private readonly authController = new AuthController();

    constructor() {
        this.initRoutes();
    }

    public get Router(): Router {
        return this.router;
    }

    private initRoutes(): void {
        this.router
            .post('/login', this.authController.login)
            // .post('/register', this.authController.register)
    }
}