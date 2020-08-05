import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpDirectory,
  uploadsDirectory: path.resolve(tmpDirectory, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpDirectory,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  })
}
