import { connect } from "mongoose";

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
        this.dbConnectionPromise = connect(`mongodb://${dbConnParams.dbHost}:${dbConnParams.dbPort}`, config);
    }

    public get DbConnection() {
        return this.dbConnectionPromise;
    }
}