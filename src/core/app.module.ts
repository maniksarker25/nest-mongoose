import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/modules/user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { NormalUserModule } from 'src/modules/normal-user/normal-user.module';

@Module({
  imports: [
    //  Load environment + custom config globally-------------------
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      envFilePath: '.env',
    }),

    // Mongoose config using values from `database.config.ts`------------------
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('database.uri'),
    //     dbName: configService.get<string>('database.dbName'),
    //   }),
    // }),

    // from database module
    DatabaseModule,

    //  Add your feature modules here ------------
    UserModule,
    NormalUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
