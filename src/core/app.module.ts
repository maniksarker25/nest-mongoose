import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/modules/user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { NormalUserModule } from 'src/modules/normal-user/normal-user.module';
import { EmailModule } from 'src/common/utils/email/email.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    //  Load environment + custom config globally-------------------
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      envFilePath: '.env',
    }),

    // crone job service
    ScheduleModule.forRoot(),

    // from database module
    DatabaseModule,
    EmailModule,

    //  Add your feature modules here ------------
    UserModule,
    NormalUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
