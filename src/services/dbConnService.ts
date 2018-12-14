import { connect } from "mongoose";
import {variables} from "../config/globals";

export interface IDbConnParams {
    dbHost: string,
    dbPort: string,
    dbName: string,
    dbUsername: string,
    dbPassword: string
}


export class DbConnService {
    private dbConnectionPromise;

    public constructor(dbConnParams: IDbConnParams) {
        const config = {
            dbName: dbConnParams.dbName,
            pass: dbConnParams.dbPassword,
            useNewUrlParser: true,
            user: dbConnParams.dbUsername,
            useCreateIndex: true
        };

        if (variables.env === 'production') {
            this.dbConnectionPromise = connect(`mongodb://${dbConnParams.dbUsername}:${dbConnParams.dbPassword}@cluster0-shard-00-00-vvy0e.mongodb.net:27017,cluster0-shard-00-01-vvy0e.mongodb.net:27017,cluster0-shard-00-02-vvy0e.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`, config);
        } else {
            this.dbConnectionPromise = connect(`mongodb://${dbConnParams.dbHost}:${dbConnParams.dbPort}`, config);
        }
        
    }

    public get DbConnection() {
        return this.dbConnectionPromise;
    }
}