import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import {createTransport} from "nodemailer";
import {compileFile} from "pug";
import {join} from "path";
import {Model} from "mongoose";
import {authModel, IAuth} from "../auth/auth.model";

export class CartController {

    private readonly transporter = createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secure: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
            user: 'correokavana@hotmail.com',
            pass: 'adminKavana.'
        }
    });

    private readonly emailTemplate = compileFile(join(process.cwd(), 'email-templates', 'budget.pug'));

    private readonly Auth: Model<IAuth> = authModel;


    @bind
    async sendCart(req: Request, res: Response, next: NextFunction): Promise<any> {

        const userId = req.params.userId;

        const user = await this.Auth.findById(userId);

        try {

            const emailHtml = this.emailTemplate({
                user,
                products: req.body.products
            });

            await this.transporter.sendMail({
                to: 'kavanayensuministros@gmail.com',
                subject: `Presupuesto para ${user.name}`,
                html: emailHtml
            });

           res.status(200).json({
               message: 'La lista de compra ha sido enviada con exito. Por favor espere que nuestro se comunique con' +
                   ' usted'
           })
        } catch (e) {
            next(e);
        }
    }
}