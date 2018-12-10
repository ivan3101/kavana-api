import {blogModel} from "./blog.model";
import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import {join} from "path";
import {promises} from "fs";

export class BlogController {
    private readonly Blog = blogModel;

    @bind
    async addPost(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const newPost = new this.Blog(req.fields);
            const postImagesPath = join(process.cwd(), 'public', 'posts', newPost._id.toString());

            await promises.mkdir(postImagesPath);

            if (Array.isArray(req.files.images)) {
                const addImgPromises = [];

                for (const image of req.files.images as any) {
                    const newImagePath = join(postImagesPath, image.name);
                    addImgPromises.push(promises.rename(image.path, newImagePath));
                    newPost.images.push(`posts/${newPost._id}/${image.name}`);
                }

                await Promise.all(addImgPromises);
            } else {
                const image = req.files.images;
                const newImagePath = join(postImagesPath, image.name);
                await promises.rename(image.path, newImagePath);
                newPost.images.push(`posts/${newPost._id}/${image.name}`);
            }

            await newPost.save();

            res
                .status(201)
                .json({
                    message: 'Post creado satisfactoriamente'
                });

        } catch (e) {
            next(e);
        }
    }

    @bind
    async deletePost(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { postId } = req.params;
            console.log(postId)
            await this.Blog.findByIdAndDelete(postId);

            const directory = join(process.cwd(), 'public', 'posts', postId);

            const files = await promises.readdir(directory);

            const deletePromises = [];

            for (const file of files) {
                deletePromises.push(promises.unlink(join(directory, file)));
            }

            await Promise.all(deletePromises);

            await promises.rmdir(directory);

            res.status(204).json();

        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    @bind
    async getPostById(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { postId } = req.params;

            const post = await this.Blog.findById(postId);

            res
                .status(200)
                .json({
                    data: {
                        post
                    }
                })
        } catch (e) {
            next(e)
        }
    }

    @bind
    async getFeaturedPosts(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const posts = await this.Blog.find({
                featured: true
            });

            res
                .status(200)
                .json({
                    data: {
                        posts
                    }
                })
        } catch (e) {
            next(e);
        }
    }

    @bind
    async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const offset = parseInt(req.query.offset) || 0;
            const limit = parseInt(req.query.limit) || 9;

            const posts = this.Blog
                .find()
                .skip(offset)
                .limit(limit) as any;

            const totalPosts = this.Blog.find().count() as any;

            const promisesResolved = await Promise.all([posts, totalPosts]);

            res
                .status(200)
                .json({
                    data: {
                        posts: promisesResolved[0],
                        totalPosts: promisesResolved[1]
                    }
                });

        } catch (error) {
            next(error);
        }
    }

    @bind
    async updatePost(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { postId } = req.params;
            const post = await this.Blog.findById(postId);

            const changes = req.fields;
            delete changes.images;

            if ((req.files.images as any).length) {
                const directory = join(process.cwd(), 'public', 'posts', postId);
                const files = await promises.readdir(directory);
                changes.images = [];

                const deletePromises = [];

                for (const file of files) {
                    deletePromises.push(promises.unlink(join(directory, file)));
                }

                await Promise.all(deletePromises);

                const addImgPromises = [];

                for (const image of req.files.images as any) {
                    const newImagePath = join(directory, image.name);
                    addImgPromises.push(promises.rename(image.path, newImagePath));
                    changes.images.push(`posts/${post._id}/${image.name}`);
                }

                await Promise.all(addImgPromises);
            }

            await this.Blog.findByIdAndUpdate(postId, {
                $set: {
                    ...changes
                }
            });

            res.status(204).json();

        } catch (e) {
            next(e);
        }
    }
}