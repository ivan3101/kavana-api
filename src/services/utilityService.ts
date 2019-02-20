import { createReadStream, promises } from "fs";
import v4 = require("uuid/v4");
import { AwsService } from "./awsService";
import { DeleteObjectRequest, PutObjectRequest } from "aws-sdk/clients/s3";
import { variables } from "../config/globals";

export class UtilityService {
  public static async deleteFile(path: string): Promise<void> {
    try {
      await promises.unlink(path);
    } catch (error) {
      return;
    }
  }

  public static async awsUpload(
    image
  ): Promise<{ imagePath: string; key: string }> {
    const awsService: AwsService = AwsService.getInstance();

    const imageStream = createReadStream(image.path);

    const imageExtension = image.name.split(".")[
      image.name.split(".").length - 1
    ];

    const keyImage = v4() + "." + imageExtension;

    const uploadParams: PutObjectRequest = {
      Bucket: variables.aws_bucket,
      Body: imageStream,
      Key: keyImage,
      ACL: "public-read"
    };

    const awsUpload = await awsService.awsS3.upload(uploadParams).promise();

    return {
      imagePath: awsUpload.Location,
      key: awsUpload.Key
    };
  }

  public static async awsDelete(key: string): Promise<void> {
    const awsService: AwsService = AwsService.getInstance();

    const awsParams: DeleteObjectRequest = {
      Bucket: variables.aws_bucket,
      Key: key
    };

    await awsService.awsS3.deleteObject(awsParams).promise();

    return;
  }
}
