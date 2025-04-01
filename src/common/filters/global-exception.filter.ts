import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorDetails: any = {};

    // NestJS HttpException
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }

    // MongoDB duplicate key error
    else if (
      exception instanceof MongoServerError &&
      exception.code === 11000
    ) {
      statusCode = HttpStatus.BAD_REQUEST;
      const key = Object.keys(exception.keyValue)[0];
      message = `${key} already exists`;
    }

    // Mongoose validation error
    else if (exception instanceof MongooseError.ValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = Object.values(exception.errors)
        .map((val) => val.message)
        .join(', ');
      errorDetails = exception.errors;
    }

    // Zod validation error
    else if (exception instanceof ZodError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = exception.issues.map((i) => i.message).join('. ') + '.';
      errorDetails = { issues: exception.issues };
    }

    // AppError
    else if (exception instanceof AppError) {
      statusCode = exception.statusCode;
      message = exception.message;
    }

    // CastError (Invalid Mongo ID)
    else if (exception?.name === 'CastError') {
      statusCode = HttpStatus.BAD_REQUEST;
      message = `${exception?.value} is not a valid ID!`;
    }

    response.status(statusCode).json({
      success: false,
      message,
      errorDetails,
      path: request.url,
      timestamp: new Date().toISOString(),
      stack:
        process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    });
  }
}
