import {Document, model, Model, Schema} from "mongoose";

export interface IAuth extends Document {
    username: string,
    password: string
}

const authSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Debe ingresar un nombre de usuario'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Debe ingresar una contraseña'],
        trim: true
    }
});

export const authModel: Model<IAuth> = model<IAuth>('usuario', authSchema);