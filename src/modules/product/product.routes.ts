import {Router} from "express";
import {ProductController} from "./product.controller";
import {join} from "path";
import formidableMiddleware = require('express-formidable');


export class ProductRoutes {
    private readonly router = Router();
    private readonly productController = new ProductController();

    constructor() {
        this.initRoutes();
    }

    public get Router() {
        return this.router;
    }

    private initRoutes() {
        this.router.get('/', this.productController.getProducts);

        this.router.post('/', formidableMiddleware({
            uploadDir: join(process.cwd(), 'uploads')
        }), this.productController.addProduct);

        this.router.get('/category/:category', this.productController.getProductsByCategory);

        this.router.get('/:productId', this.productController.getProductByid);

        this.router.patch('/:productId', formidableMiddleware({
            uploadDir: join(process.cwd(), 'uploads')
        }), this.productController.updateProduct);

        this.router.delete('/:productId', this.productController.deleteProduct);
    }
}