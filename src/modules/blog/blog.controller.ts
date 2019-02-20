import { blogModel } from "./blog.model";
import { bind } from "decko";
import { Request, Response, NextFunction } from "express";
import { UtilityService } from "../../services/utilityService";

export class BlogController {
  private readonly Blog = blogModel;

  @bind
  async addPost(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const addImgPromises = [];

      if (Array.isArray(req.files.images)) {
        for (const image of req.files.images) {
          addImgPromises.push(UtilityService.awsUpload(image));
        }
      } else {
        addImgPromises.push(UtilityService.awsUpload(req.files.images));
      }

      const newPost = new this.Blog(req.fields);

      const imagesUploaded = await Promise.all<{
        key: string;
        imagePath: string;
      }>(addImgPromises);

      for (const imageUploaded of imagesUploaded) {
        newPost.images.push({
          key: imageUploaded.key,
          path: imageUploaded.imagePath
        });
      }

      await newPost.save();

      res.status(201).json({
        message: "Post creado satisfactoriamente"
      });
    } catch (e) {
      next(e);
    }
  }

  @bind
  async deletePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { postId } = req.params;

      const { images } = await this.Blog.findByIdAndDelete(postId);

      const deleteImagesPromises = [];

      for (const image of images) {
        deleteImagesPromises.push(UtilityService.awsDelete(image.key));
      }

      await Promise.all(deleteImagesPromises);

      res.status(204).json();
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  @bind
  async getPostById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { postId } = req.params;

      const post = await this.Blog.findById(postId);

      res.status(200).json({
        data: {
          post
        }
      });
    } catch (e) {
      next(e);
    }
  }

  @bind
  async getFeaturedPosts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const posts = await this.Blog.find({
        featured: true
      });

      res.status(200).json({
        data: {
          posts
        }
      });
    } catch (e) {
      next(e);
    }
  }

  @bind
  async getAllPosts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 9;

      const posts = this.Blog.find()
        .skip(offset)
        .limit(limit) as any;

      const totalPosts = this.Blog.find().count() as any;

      const promisesResolved = await Promise.all([posts, totalPosts]);

      res.status(200).json({
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
  async updatePost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { postId } = req.params;
      const post = await this.Blog.findById(postId);

      const changes = req.fields as any;
      delete changes.images;

      if (req.files.images) {
        const deletedImagesPromises = [];

        for (const image of post.images) {
          deletedImagesPromises.push(UtilityService.awsDelete(image.key));
        }

        await Promise.all(deletedImagesPromises);

        const addImgPromises = [];

        if (Array.isArray(req.files.images)) {
          for (const image of req.files.images) {
            addImgPromises.push(UtilityService.awsUpload(image));
          }
        } else {
          addImgPromises.push(UtilityService.awsUpload(req.files.images));
        }

        const imagesUploaded = await Promise.all<{
          key: string;
          imagePath: string;
        }>(addImgPromises);

        for (const imageUploaded of imagesUploaded) {
          changes.images.push({
            key: imageUploaded.key,
            path: imageUploaded.imagePath
          });
        }
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
