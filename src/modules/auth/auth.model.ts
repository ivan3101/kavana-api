import {Document, model, Model, Schema} from "mongoose";

export enum UserRole {
    user = "USER",
    admin = "ADMIN"
}

export interface IAuth extends Document {
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    identification: string,
    email: string,
    role: UserRole
}

const authSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Debe ingresar un nombre de usuario'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Debe ingresar una contraseña'],
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    identification: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    role: {
        type: UserRole,
        required: true
    }
});

export const authModel: Model<IAuth> = model<IAuth>('usuario', authSchema);