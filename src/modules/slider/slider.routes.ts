import {Router} from "express";
import {SliderController} from "./slider.controller";
import {join} from "path";
import formidableMiddleware = require('express-formidable');

export class SliderRoutes {
    private readonly router = Router();
    private readonly sliderController = new SliderController();

    constructor() {
        this.initRoutes();
    }

    public get Router() {
        return this.router;
    }

    private initRoutes() {
        this.router
            .get('/', this.sliderController.getAllImages)
            .post('/', formidableMiddleware({
                uploadDir: join(process.cwd(), 'uploads')
            }), this.sliderController.addImage)
            .delete('/:sliderId', this.sliderController.deleteImage)
    }
}