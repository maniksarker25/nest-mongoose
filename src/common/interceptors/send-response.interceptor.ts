import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SendResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const statusCode = data?.statusCode || res.statusCode;

        // You can optionally set the status manually too
        res.status(statusCode);

        return {
          success: true,
          message: data?.message || 'Request successful',
          meta: data?.meta,
          data: data?.data ?? data,
        };
      }),
    );
  }
}
