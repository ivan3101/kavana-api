import { ISlider, sliderModel } from "./slider.model";
import { bind } from "decko";
import { NextFunction, Request, Response } from "express";
import { UtilityService } from "../../services/utilityService";
import { Model } from "mongoose";

export class SliderController {
  private readonly Slider: Model<ISlider> = sliderModel;

  @bind
  async getAllImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const sliders = await this.Slider.find();

      res.status(200).json({
        data: {
          sliders
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @bind
  async addImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const uploadedImage = await UtilityService.awsUpload(req.files.image);

      const newSlider = new this.Slider({
        image: uploadedImage.imagePath,
        message: req.fields.message,
        key: uploadedImage.key
      });

      await newSlider.save();

      res.status(201).json({
        message: "Imagen agregada satisfactoriamente"
      });
    } catch (e) {
      next(e);
    }

    await UtilityService.deleteFile(req.files.image.path);
  }

  @bind
  async deleteImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { sliderId } = req.params;

      const sliderDeleted = await this.Slider.findByIdAndDelete(sliderId);

      await UtilityService.awsDelete(sliderDeleted.key);

      res.status(204).json();
    } catch (e) {
      next(e);
    }
  }
}
