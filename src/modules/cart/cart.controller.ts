import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import {createTransport} from "nodemailer";
import {compileFile} from "pug";
import {join} from "path";

export class CartController {

    private readonly transporter = createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secure: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
            user: 'no.reply.kavana.revestimientos@outlook.com',
            pass: 'v5V0S*1l'
        }
    });

    private readonly emailTemplate = compileFile(join(process.cwd(), 'email-templates', 'budget.pug'));


    @bind
    async sendCart(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const emailHtml = this.emailTemplate({
                user: req.body.user,
                products: req.body.products
            });


            await this.transporter.sendMail({
                to: 'info@kavanarevestimientos.com',
                subject: `Presupuesto para ${req.body.user.name} ${req.body.user.lastname}`,
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