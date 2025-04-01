import * as path from 'path';
import { createLogger, format, transports } from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file'); // ✅ Fix import

const { combine, timestamp, label, printf, colorize } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp as string);
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `${date.toDateString()} ${time} [${label}] ${level}: ${message}`;
});

const logDir = path.join(process.cwd(), 'logs');

export const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'NestJS App' }), timestamp(), logFormat),
  transports: [
    new transports.Console({
      format: combine(
        colorize(), // ✅ colorful logs
        label({ label: 'NestJS App' }),
        timestamp(),
        logFormat,
      ),
    }),
    new transports.File({
      filename: path.join(logDir, 'successes', 'app-success.log'),
      level: 'info',
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'successes', 'app-%DATE%-success.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
  ],
});

export const errorLogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'NestJS App' }), timestamp(), logFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'errors', 'app-%DATE%-error.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
  ],
});
