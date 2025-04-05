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
