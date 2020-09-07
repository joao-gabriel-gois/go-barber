import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk'; // AMAZON CDN PROVIDER!
import uploadConfig from '@config/upload';

import IStorageProvider from "../models/IStorageProvider";

// For CDN dealing, for now will only move to uploads directory

export default class DiskStorageProvider implements IStorageProvider {
  private client: S3;
  
  constructor() {
    this.client = new aws.S3({
      region: 'us-east-2'
    })
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpDirectory, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client.putObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }).promise()

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
    }).promise();
  }
}
