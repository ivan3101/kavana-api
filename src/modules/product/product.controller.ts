import {Model} from "mongoose";
import {IProduct, productModel} from "./product.model";
import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import {join} from "path";
import {promises} from "fs";

export class ProductController {
    private readonly Product: Model<IProduct> = productModel;

    @bind
    async addProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const newProduct = new this.Product(req.fields);

            newProduct.characteristics = (req.fields.characteristics as string).split(',');

            const productsImagesPath = join(process.cwd(), 'public', 'products', newProduct._id.toString());

            await promises.mkdir(productsImagesPath);

            const newIconPath = join(productsImagesPath, req.files.icon.name);
            const newBannerPath = join(productsImagesPath, req.files.banner.name);

            const iconPromise = promises.rename(req.files.icon.path, newIconPath);
            const bannerPromise = promises.rename(req.files.banner.path, newBannerPath);

            newProduct.icon = `products/${newProduct._id}/${req.files.icon.name}`;
            newProduct.banner = `products/${newProduct._id}/${req.files.banner.name}`;

            await Promise.all([iconPromise, bannerPromise]);

            await newProduct.save();

            res
                .status(201)
                .json({
                    message: 'Producto agregado satisfactoriamente'
                });

        } catch (e) {
            next(e);
        }
    }

    @bind
    async getProducts(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const offset = parseInt(req.query.offset) || 0;
            const limit = req.query.limit || 9;

            const products = this.Product
                .find()
                .skip(offset)
                .limit(limit) as any;

            const totalProducts = this.Product.find().count() as any;

            const promisesResolved = await Promise.all([products, totalProducts]);

            res
                .status(200)
                .json({
                    data: {
                        products: promisesResolved[0],
                        totalProducts: promisesResolved[1]
                    }
                });

        } catch (error) {
            next(error);
        }
    }

    @bind
    async getProductByid(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { productId } = req.params;

            const product = await this.Product.findById(productId);

            res
                .status(200)
                .json({
                    data:{
                        product
                    }
                })

        } catch (e) {
            next(e)
        }
    }

    @bind
    async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { productId } = req.params;

            await this.Product.findByIdAndDelete(productId);

            const directory = join(process.cwd(), 'public', 'products', productId);

            const files = await promises.readdir(directory);

            const deletePromises = [];

            for (const file of files) {
                deletePromises.push(promises.unlink(join(directory, file)));
            }

            await Promise.all(deletePromises);

            await promises.rmdir(directory);

            res.status(204).json();

        } catch (e) {
            next(e);
        }
    }

    @bind
    async updateProduct(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { productId } = req.params;
            const product = await this.Product.findById(productId);

            const changes = req.fields;
            changes.characteristics = (req.fields.characteristics as string).split(',');
            delete changes.icon;
            delete changes.banner;

            if (req.files.icon) {
                await promises.unlink(join(process.cwd(), 'public', product.icon));

                const productsImagesPath = join(process.cwd(), 'public', 'products', productId);
                const newIconPath = join(productsImagesPath, req.files.icon.name);
                await promises.rename(req.files.icon.path, newIconPath);

                changes.icon = `products/${productId}/${req.files.icon.name}`;
            }

            if (req.body.banner) {
                await promises.unlink(join(process.cwd(), 'public', product.banner));

                const productsImagesPath = join(process.cwd(), 'public', 'products', productId);
                const newIconPath = join(productsImagesPath, req.files.banner.name);
                await promises.rename(req.files.banner.path, newIconPath);

                changes.banner = `products/${productId}/${req.files.banner.name}`;
            }


            await this.Product.findByIdAndUpdate(productId, {
                $set: {
                    ...changes,
                    characteristics: changes.characteristics
                }
            });

            res.status(204).json();

        } catch (e) {
            next(e);
        }
    }

    @bind
    async getProductsByCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { category } = req.params;
            const offset = parseInt(req.query.offset) || 0;
            const limit = req.query.limit || 9;

            const products = this.Product
                .find({
                    'category': category
                })
                .skip(offset)
                .limit(limit) as any;

            const totalProducts = this.Product.find({
                'category': category
            }).count() as any;

            const promisesResolved = await Promise.all([products, totalProducts]);

            res
                .status(200)
                .json({
                    data:{
                        products: promisesResolved[0],
                        totalProducts: promisesResolved[1]
                    }
                })

        } catch (e) {
            next(e)
        }
    }
}