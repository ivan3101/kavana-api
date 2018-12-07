import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import {messageModel, IMessage} from "./message.model";
import {Model} from "mongoose";

export class MessageController {
    private readonly Message: Model<IMessage> = messageModel;

    @bind
    async addMessage(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const message = new this.Message(req.body);

            if (!req.body.message) {
                message.message = 'Quiero ser su Aliado'
            }

            await message.save();

            res
                .status(201)
                .json({
                    message: 'Mensaje enviado con exito',
                    status: 'Satisfactorio'
                });
        } catch (error) {
            next(error);
        }
    }

    @bind
    async getMessages(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const offset = req.query.offset || 0;
            const limit = req.query.limit || 6;

            const messages = this.Message
                .find()
                .skip(offset)
                .limit(limit) as any;

            const totalMessages = this.Message.find().count() as any;

            const promisesResolved = await Promise.all([messages, totalMessages]);

            res
                .status(200)
                .json({
                    data: {
                        messages: promisesResolved[0],
                        totalMessages: promisesResolved[1]
                    }
                });

        } catch (error) {
            next(error);
        }
    }
}