import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './database.config';
import configuration from '../config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [DatabaseConfig],
      load: configuration,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // uri: configService.get<string>('database.mongoUri'),
        // dbName: configService.get<string>('database.dbName'),
        uri: configService.get<string>('database.uri'),
        dbName: configService.get<string>('database.dbName'),
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
