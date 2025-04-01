import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeHtmlPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Sanitize all string values inside objects
    if (typeof value === 'object' && value !== null) {
      const sanitized = { ...value };
      for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
          sanitized[key] = sanitizeHtml(sanitized[key], {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
              'img',
              'h1',
              'h2',
            ]),
            allowedAttributes: {
              '*': ['style', 'class'],
              a: ['href', 'name', 'target'],
              img: ['src', 'alt'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
          });
        }
      }
      return sanitized;
    }

    // If it's just a string, sanitize directly
    if (typeof value === 'string') {
      return sanitizeHtml(value);
    }

    return value;
  }
}
