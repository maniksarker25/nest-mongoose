// import {
//   ArgumentMetadata,
//   Injectable,
//   PipeTransform,
//   BadRequestException,
// } from '@nestjs/common';

// @Injectable()
// export class ParseFormDataPipe implements PipeTransform {
//   transform(value: any, metadata: ArgumentMetadata) {
//     if (typeof value === 'object' && value.data) {
//       try {
//         const parsed = JSON.parse(value.data);
//         return { ...value, ...parsed }; // Merge parsed data into the body
//       } catch (err) {
//         throw new BadRequestException('Invalid JSON in "data" field');
//       }
//     }
//     return value;
//   }
// }

// for class supoort
// src/common/pipes/parse-formdata.pipe.ts
// src/common/pipes/parse-formdata.pipe.ts
// src/common/pipes/parse-formdata.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class ParseFormDataPipe implements PipeTransform {
  constructor(private dto: any) {}

  transform(value: any) {
    if (!value?.data) return value;

    try {
      const parsed = JSON.parse(value.data);
      const merged = { ...value, ...parsed };
      delete merged.data;

      const dtoInstance = plainToInstance(this.dto, merged);
      const errors = validateSync(dtoInstance, { whitelist: true });

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }

      return dtoInstance;
    } catch (err) {
      throw new BadRequestException('Invalid JSON in data field');
    }
  }
}
