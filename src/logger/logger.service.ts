import { Injectable, LoggerService } from '@nestjs/common';
import { logger, errorLogger } from './logger';

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string, trace?: string) {
    errorLogger.error(`${message} ${trace || ''}`);
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug?.(message);
  }

  verbose(message: string) {
    logger.verbose?.(message);
  }
}
