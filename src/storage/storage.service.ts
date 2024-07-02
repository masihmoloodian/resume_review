import { BadRequestException, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import * as path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
const pipelineAsync = promisify(pipeline);

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucketName: string;
  private s3Endpoint: string;

  constructor() {
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;
    const region = process.env.AWS_REGION;
    this.s3Endpoint = process.env.S3_ENDPOINT;
    this.bucketName = process.env.AWS_BUCKET_NAME;

    this.s3 = new S3Client({
      region: region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      endpoint: this.s3Endpoint,
      forcePathStyle: true,
    });
  }

  async generatePublicUrl(objectKey: string) {
    const baseUrl = process.env.S3_PUBLIC_BASE_URL;
    await this.getObject(objectKey);
    const path = `${baseUrl}/${this.bucketName}/${objectKey}`;
    return path;
  }

  async getObject(key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      return await this.s3.send(command);
    } catch (err) {
      throw new BadRequestException('Enter valid object key');
    }
  }
  async saveObject(data: GetObjectCommandOutput, key: string): Promise<string> {
    if (!data.Body) throw new BadRequestException('Invalid data body');

    const dirPath = path.join('/tmp', path.dirname(key));
    if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });

    const filePath = path.join('/tmp', key);
    const writeStream = createWriteStream(filePath);

    // Convert the AWS SDK stream to a Node.js stream if necessary
    const readableStream = (data.Body as any).transformToWebStream
      ? (data.Body as any).transformToWebStream()
      : data.Body;

    try {
      await pipelineAsync(readableStream, writeStream);
      return filePath;
    } catch (err) {
      console.log(err);

      throw new BadRequestException('Error saving file');
    }
  }

  async upload(
    file: Express.Multer.File,
    folderName: 'public' | 'private',
  ): Promise<string> {
    const { filename, path, mimetype } = file;
    const buffer = readFileSync(path);

    const key = `${folderName}/${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    try {
      await this.s3.send(command);
      return key;
    } catch (error) {
      console.error('Error uploading to S3', error);
      throw new Error('Error uploading file to S3');
    }
  }
}
