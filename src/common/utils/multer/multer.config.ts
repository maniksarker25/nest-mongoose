// src/common/utils/upload/multer.config.ts

import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// 👇 Map your form field names to directories
const fieldToDestinationMap: Record<string, string> = {
  mainImage: './uploads/products/main',
  additionalImages: './uploads/products/additional',
  profileImage: './uploads/profile',
};

const ensureDirectoryExists = (dirPath: string) => {
  const fullPath = path.resolve(dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
};

export const generateFilename = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
  cb(null, uniqueName);
};

export const dynamicStorage = diskStorage({
  destination: (req, file, cb) => {
    const field = file.fieldname;
    const folder = fieldToDestinationMap[field];

    if (!folder) {
      //  Throw error for unknown field
      return cb(
        new Error(
          `Upload blocked: Unknown field name "${field}". Allowed fields: ${Object.keys(
            fieldToDestinationMap,
          ).join(', ')}`,
        ),
        '',
      );
    }

    // ✅ Ensure the folder exists
    ensureDirectoryExists(folder);

    cb(null, folder);
  },

  filename: generateFilename,
});
