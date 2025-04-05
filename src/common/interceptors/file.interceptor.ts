import { FileInterceptor } from '@nestjs/platform-express';
import { dynamicStorage } from '../utils/multer/multer.config';

export const SingleFileUpload = (fieldName: string) =>
  FileInterceptor(fieldName, {
    storage: dynamicStorage,
  });
