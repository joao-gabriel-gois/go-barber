import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpDirectory = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpDirectory: string;
  uploadsDirectory: string;
  multer: {
    storage: StorageEngine,
  },
  config: {
    disk: {},
    aws: {
      bucket: string;
    }
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpDirectory,
  multer: {
    storage: multer.diskStorage({
      destination: tmpDirectory,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const filename = `${fileHash}-${file.originalname}`;

        return callback(null, filename);
      },
    }),
  },
  uploadsDirectory: path.resolve(tmpDirectory, 'uploads'),
  config: {
    disk: {},
    aws: {
      bucket: 'app-go-barber-bucket',
    }
  }
} as IUploadConfig;
