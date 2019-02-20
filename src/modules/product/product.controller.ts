import { Model } from "mongoose";
import { IProduct, productModel } from "./product.model";
import { bind } from "decko";
import { Request, Response, NextFunction } from "express";
import { UtilityService } from "../../services/utilityService";

export class ProductController {
  private readonly Product: Model<IProduct> = productModel;

  @bind
  async addProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const iconUploaded = await UtilityService.awsUpload(req.files.icon);
      const bannerUploaded = await UtilityService.awsUpload(req.files.banner);

      const newProduct = new this.Product(req.fields);

      newProduct.characteristics = (req.fields.characteristics as string).split(
        ","
      );
      newProduct.icon = {
        key: iconUploaded.key,
        path: iconUploaded.imagePath
      };
      newProduct.banner = {
        key: bannerUploaded.key,
        path: bannerUploaded.imagePath
      };

      await newProduct.save();

      res.status(201).json({
        message: "Producto agregado satisfactoriamente"
      });
    } catch (e) {
      next(e);
    }
  }

  @bind
  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 9;

      const products = this.Product.find()
        .sort("-_id")
        .skip(offset)
        .limit(limit) as any;

      const totalProducts = this.Product.find().count() as any;

      const promisesResolved = await Promise.all([products, totalProducts]);

      res.status(200).json({
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
  async getProductByid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { productId } = req.params;

      const product = await this.Product.findById(productId);

      res.status(200).json({
        data: {
          product
        }
      });
    } catch (e) {
      next(e);
    }
  }

  @bind
  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { productId } = req.params;

      const { icon, banner } = await this.Product.findByIdAndDelete(productId);

      await Promise.all([
        UtilityService.awsDelete(icon.key),
        UtilityService.awsDelete(banner.key)
      ]);

      res.status(204).json();
    } catch (e) {
      next(e);
    }
  }

  @bind
  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { productId } = req.params;
      const product = await this.Product.findById(productId);

      const changes = req.fields as any;
      changes.characteristics = (req.fields.characteristics as string).split(
        ","
      );
      delete changes.icon;
      delete changes.banner;

      if (req.files.icon) {
        const [iconUploaded] = await Promise.all([
          UtilityService.awsUpload(req.files.icon),
          UtilityService.awsDelete(product.icon.key)
        ]);

        changes.icon = {
            key: iconUploaded.key,
            path: iconUploaded.imagePath
        };
      }

      if (req.body.banner) {
          const [bannerUpload] = await Promise.all([
              UtilityService.awsUpload(req.files.banner),
              UtilityService.awsDelete(product.banner.key)
          ]);

          changes.banner = {
              key: bannerUpload.key,
              path: bannerUpload.imagePath
          }
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
  async getProductsByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { category } = req.params;
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 9;
      console.log(offset, limit, category);

      const products = this.Product.find({
        category: category
      })
        .skip(offset)
        .limit(limit) as any;

      const totalProducts = this.Product.find({
        category: category
      }).count() as any;

      const promisesResolved = await Promise.all([products, totalProducts]);
      console.log(promisesResolved[0]);
      res.status(200).json({
        data: {
          products: promisesResolved[0],
          totalProducts: promisesResolved[1]
        }
      });
    } catch (e) {
      next(e);
    }
  }
}
