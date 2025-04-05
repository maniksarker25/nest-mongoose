import { FilesInterceptor } from '@nestjs/platform-express';
import { dynamicStorage } from '../utils/multer/multer.config';

export const MultipleFilesUpload = (fieldName: string, maxCount = 5) =>
  FilesInterceptor(fieldName, maxCount, {
    storage: dynamicStorage,
  });
