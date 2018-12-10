import {Router} from "express";
import {join} from "path";
import formidableMiddleware = require('express-formidable');
import {BlogController} from "./blog.controller";


export class BlogRoutes {
    private readonly router = Router();
    private readonly blogController = new BlogController();

    constructor() {
        this.initRoutes();
    }

    public get Router() {
        return this.router;
    }

    private initRoutes() {
        this.router.get('/', this.blogController.getAllPosts);

        this.router.post('/', formidableMiddleware({
            uploadDir: join(process.cwd(), 'uploads'),
            multiples: true
        }), this.blogController.addPost);

        this.router.get('/featured', this.blogController.getFeaturedPosts);

        this.router.get('/:postId', this.blogController.getPostById);

        this.router.patch('/:postId', formidableMiddleware({
            uploadDir: join(process.cwd(), 'uploads'),
            multiples: true
        }), this.blogController.updatePost);

        this.router.delete('/:postId', this.blogController.deletePost);
    }
}