import {Document, model, Model, Schema, Types} from "mongoose";

export interface ISlider extends Document {
    _id: Types.ObjectId,
    message: string,
    image: string
}

const sliderSchema = new Schema({
    message: String,
    image: String
});

export const sliderModel: Model<ISlider> = model<ISlider>('slider', sliderSchema);