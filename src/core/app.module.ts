import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/modules/user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { NormalUserModule } from 'src/modules/normal-user/normal-user.module';
import { EmailService } from 'src/utils/sendEmail';

@Module({
  imports: [
    //  Load environment + custom config globally-------------------
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      envFilePath: '.env',
    }),

    // from database module
    DatabaseModule,

    //  Add your feature modules here ------------
    UserModule,
    NormalUserModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
