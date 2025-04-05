import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseFormDataPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value.data) {
      try {
        const parsed = JSON.parse(value.data);
        return { ...value, ...parsed }; // Merge parsed data into the body
      } catch (err) {
        throw new BadRequestException('Invalid JSON in "data" field');
      }
    }
    return value;
  }
}
