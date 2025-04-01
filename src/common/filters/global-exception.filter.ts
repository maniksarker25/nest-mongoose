import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { MongoServerError } from 'mongodb';
import { TGenericErrorResponse } from '../errors/interfaces/error.interface';
import handleZodError from '../errors/helpers/handleZodError';
import handleValidationError from '../errors/helpers/handleValidationError';
import handleDuplicateError from '../errors/helpers/handleDuplicateError';
import handleCastError from '../errors/helpers/handleCastError';
import { AppError } from '../errors/app-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // console.log('the exceptions is', exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let customError: TGenericErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong!',
      errorType: 'Unknow error',
      errorSources: [],
    };

    // Zod validation
    if (exception instanceof ZodError) {
      customError = handleZodError(exception);
    }

    // Mongoose validation
    else if (exception instanceof mongoose.Error.ValidationError) {
      customError = handleValidationError(exception);
    }

    // Duplicate key
    else if (
      exception instanceof MongoServerError &&
      exception.code === 11000
    ) {
      customError = handleDuplicateError(exception);
    }

    // Cast Error (invalid ID)
    else if (
      exception instanceof mongoose.Error.CastError ||
      (typeof exception === 'object' &&
        exception !== null &&
        'name' in exception &&
        exception['name'] === 'CastError')
    ) {
      customError = handleCastError(exception as mongoose.Error.CastError);
    }

    // App-defined error
    else if (exception instanceof AppError) {
      customError = {
        statusCode: exception.statusCode,
        message: exception.message,
        errorSources: [],
      };
    }

    // Built-in NestJS HttpException
    else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      const validationMessages =
        typeof response === 'object' &&
        response !== null &&
        'message' in response
          ? (response as any).message
          : [];

      const isArray = Array.isArray(validationMessages);

      const errorSources = isArray
        ? validationMessages.map((msg) => ({ path: '', message: msg }))
        : [{ path: '', message: exception.message }];

      const combinedMessage = isArray
        ? validationMessages.join(', ') + '.'
        : exception.message;

      customError = {
        statusCode: status,
        message: combinedMessage,
        errorType: 'Validation Failed',
        errorSources,
      };
    }

    res.status(customError.statusCode).json({
      success: false,
      message: customError.message,
      errorType: customError.errorType,
      errorDetails: customError.errorSources,
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
      stack:
        process.env.NODE_ENV === 'development'
          ? (exception as any)?.stack
          : undefined,
    });
  }
}
