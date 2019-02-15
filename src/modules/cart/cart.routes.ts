import {Router} from "express";
import {CartController} from "./cart.controller";

export class CartRoutes {
    private readonly router = Router();
    private readonly cartController = new CartController();

    constructor() {
        this.initRoutes();
    }

    public get Router() {
        return this.router;
    }

    private initRoutes() {
        this.router.post('/:userId', this.cartController.sendCart)
    }
}