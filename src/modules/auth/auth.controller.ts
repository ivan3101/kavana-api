import {authModel, IAuth} from "./auth.model";
import {Model} from "mongoose";
import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import {unauthorized} from "boom";
import {compare, hash} from "bcrypt";

export class AuthController {
    private readonly Auth: Model<IAuth> = authModel;

    @bind
    async register(req: Request, res: Response, next: NextFunction): Promise<any> {

        const { username, password } = req.body;

        const hashedPassword = await hash(password, 15);

        const newUser = new this.Auth({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res
            .status(201)
            .json();
    }

    @bind
    async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { username, password } = req.body;

        const user = await this.Auth.findOne({
            username
        });

        if (!user) {
            return next(unauthorized('Nombre de usuario o contraseña incorrectos'));
        }

        if (await compare(password, user.password)) {
            res
                .status(200)
                .json({
                    data: {
                        username: user.username
                    }
                });
        } else {
            return next(unauthorized('Nombre de usuario o contraseña incorrectos'));
        }
    }
}