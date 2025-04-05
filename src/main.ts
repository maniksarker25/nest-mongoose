import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendResponseInterceptor } from './common/interceptors/send-response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppLogger } from './logger/logger.service';

async function bootstrap() {
  const logger = new AppLogger(); // ✅ instantiate once and reuse

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new SendResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;

  await app.listen(port);
  logger.log(`🚀 App running on http://localhost:${port}`);
}
bootstrap();
