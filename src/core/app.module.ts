import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    //  Load environment + custom config globally-------------------
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      envFilePath: '.env',
    }),

    // Mongoose config using values from `database.config.ts`------------------
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        dbName: configService.get<string>('database.dbName'),
      }),
    }),

    //  Add your feature modules here ------------
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
