import {Document, model, Model, Schema, Types} from "mongoose";

export interface ISlider extends Document {
    _id: Types.ObjectId,
    message: string,
    image: string,
    key: string
}

const sliderSchema = new Schema({
    message: String,
    image: String,
    key: String
});

export const sliderModel: Model<ISlider> = model<ISlider>('slider', sliderSchema);