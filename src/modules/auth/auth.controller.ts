import {authModel, IAuth, UserRole} from "./auth.model";
import {Model, Document} from "mongoose";
import {bind} from "decko";
import {NextFunction, Request, Response} from "express";
import {conflict, unauthorized} from "boom";
import {compare, hash} from "bcrypt";

export class AuthController {
    private readonly Auth: Model<IAuth> = authModel;

    @bind
    async register(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, username, password, identification } = req.body;

            const existEmailPromise = this.Auth.findOne({
                email: email
            }).exec();

            console.log(existEmailPromise);

            const existUsernamePromise = this.Auth.findOne({
                username
            }).exec();

            const existIdentificationPromise = this.Auth.findOne({
                identification
            }).exec();

            const [existEmail, existUsername, existIdentification] = await Promise.all([existEmailPromise, existUsernamePromise, existIdentificationPromise]);

            if (existEmail) {
                return next(conflict("Ya existe un usuario con ese correo electronico. Por favor, intente con otro" +
                    " correo" +
                    " electronico"));
            }

            if (existUsername) {
                return next(conflict("Ya existe un usuario con ese nombre de usuario. Por favor, intente con otro" +
                    " nombre de usuario "));
            }

            if (existIdentification) {
                return next(conflict("Ya existe un usuario con esa cedula. Por favor, intente con otro nombre de" +
                    " usuario"))
            }

            const hashedPassword = await hash(password, 15);

            const newUser = new this.Auth(req.body);

            newUser.password = hashedPassword;
            newUser.role = UserRole.user;

            await newUser.save();

            res
                .status(201)
                .json({
                    httpCode: 201,
                    data: {},
                    message: "Se ha registrado con exito",
                    status: "successful"
                });
        } catch (e) {
            next(e);
        }
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
                        username: user.username,
                        role: user.role
                    }
                });
        } else {
            return next(unauthorized('Nombre de usuario o contraseña incorrectos'));
        }
    }
}