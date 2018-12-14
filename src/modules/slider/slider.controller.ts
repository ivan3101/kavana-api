import {sliderModel} from "./slider.model";
import {bind} from "decko";
import {NextFunction, Request, Response} from "express";
import {join} from "path";
import {promises} from "fs";

export class SliderController {
    private readonly Slider = sliderModel;

    @bind
    async getAllImages(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const sliders = await this.Slider.find();

            res
                .status(200)
                .json({
                    data: {
                        sliders
                    }
                });

        } catch (error) {
            next(error);
        }
    }

    @bind
    async addImage(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const newSlider = new this.Slider(req.fields);

            const sliderImagesPath = join(process.cwd(), 'public', 'slider', newSlider._id.toString());

            await promises.mkdir(sliderImagesPath);

            const newImagePath = join(sliderImagesPath, req.files.image.name);

            const imagePromise = promises.rename(req.files.image.path, newImagePath);

            newSlider.image = `slider/${newSlider._id}/${req.files.image.name}`;

            await imagePromise;

            await newSlider.save();

            res
                .status(201)
                .json({
                    message: 'Imagen agregada satisfactoriamente'
                });

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    @bind
    async deleteImage(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { sliderId } = req.params;

            await this.Slider.findByIdAndDelete(sliderId);

            const directory = join(process.cwd(), 'public', 'slider', sliderId);

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
}