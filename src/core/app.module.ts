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
import { SeedModule } from 'src/seed/seed.module';

@Module({
  imports: [
    //  Load environment + custom config globally-------------------
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      envFilePath: '.env',
    }),

    // crone job -----------------
    ScheduleModule.forRoot(),

    // from database module ------------------
    DatabaseModule,
    EmailModule,

    // feature modules here ------------
    UserModule,
    NormalUserModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
