import {Application} from "express";
import {Server} from "./server";
import {variables} from "./config/globals";
import {createServer, Server as HttpServer} from "http";
import {DbConnService, IDbConnParams} from "./services/dbConnService";
import {connection} from "mongoose";
import {promises} from "fs";
import {join} from "path";

const app: Application = new Server().App;
const port: number = variables.port;
const server: HttpServer = createServer(app);

const dbParams: IDbConnParams = {
    dbHost: variables.db_host,
    dbName: variables.db_name,
    dbPassword: variables.db_password,
    dbPort: variables.db_port,
    dbUsername: variables.db_username
};

(
    async function () {
        try {
            await new DbConnService(dbParams).DbConnection;
            server.listen(port);
            server.on("listening", () => {

                promises.mkdir(join(process.cwd(), 'uploads'))
                    .then(_ => null)
                    .catch(_ => null);

                promises.mkdir(join(process.cwd(), 'public', 'posts'))
                    .then(_ => null)
                    .catch(_ => null);

                promises.mkdir(join(process.cwd(), 'public', 'products'))
                    .then(_ => null)
                    .catch(_ => null);

                promises.mkdir(join(process.cwd(), 'public', 'slider'))
                    .then(_ => null)
                    .catch(_ => null);

                process
                    .on('SIGINT', () => {
                        Server.closeConnection(server);
                    })
                    .on("SIGTERM", () => {
                        Server.closeConnection(server);
                    })
                    .on("SIGUSR2", () => {
                        server.close(() => {
                            connection.close(true,() => {
                                process.kill(process.pid, 'SIGUSR2');
                            })
                        })
                    });
            });

            server.on("error", (err) => {
                throw new Error(err.message);
            });

        } catch (error) {
            throw new Error(error.message);
        }
    }
) ();