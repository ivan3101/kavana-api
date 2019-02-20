import {ClientConfiguration} from "aws-sdk/clients/s3";
import {variables} from "../config/globals";
import {S3} from "aws-sdk/clients/all";

export class AwsService {

    public static getInstance(): AwsService {
        if (!AwsService.instance) {
            AwsService.instance = new AwsService();
        }

        return AwsService.instance;
    }

    private static instance: AwsService;

    private readonly config: ClientConfiguration = {
        accessKeyId: variables.aws_user_key,
        secretAccessKey: variables.aws_user_secret
    };

    public readonly awsS3: S3;

    private constructor() {
        this.awsS3 = new S3(this.config);
    }
}