import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { NormalUserModule } from '../normal-user/normal-user.module';
import { EmailService } from 'src/utils/sendEmail';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NormalUserModule,
  ],
  controllers: [UserController],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
