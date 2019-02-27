import {Document, Model, Schema, model, Types} from "mongoose";

export interface IProduct extends Document{
    _id: Types.ObjectId,
    name: string,
    sku: string,
    size: string,
    sizeByBox: string,
    piecesByBox: string,
    characteristics: string[],
    icon: {
        path: string,
        key: string
    },
    banner: {
        path: string,
        key: string
    },
    category: string
}

const productSchema = new Schema({
    name: String,
    sku: String,
    size: {
        type: String,
        default: "00x00"
    },
    sizeByBox: {
        type: String,
        default: "0"
    },
    piecesByBox: String,
    characteristics: [String],
    icon: {
        path: String,
        key: String
    },
    banner: {
        path: String,
        key: String
    },
    category: String
});

export const productModel: Model<IProduct> = model<IProduct>('producto', productSchema);