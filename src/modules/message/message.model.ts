import {Model, Schema, Types, Document, model} from "mongoose";

export interface IMessage extends Document {
    _id: Types.ObjectId,
    name: string,
    lastname: string,
    email: string,
    phone: string,
    message: string
}

const messageSchema = new Schema({
    name: {
        type: String,
        required: [true, "Debe ingresar su nombre"],
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Debe ingresar su email"],
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        validate: [/^([0-9]{4})-([0-9]{7}$)/, "El numero de telefono ingresado tiene un formato erroneo"]
    },
    message: {
        type: String,
        required: [true, "Debe ingresar su mensaje"],
        trim: true
    }
});

export const messageModel: Model<IMessage> = model<IMessage>('mensaje', messageSchema);