import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NormalUser, NormalUserSchema } from './schemas/normal-user.schema';
import { NormalUserController } from './controllers/normal-user.controller';
import { NormalUserService } from './services/normal-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NormalUser.name, schema: NormalUserSchema },
    ]),
  ],
  controllers: [NormalUserController],
  providers: [NormalUserService],
  exports: [NormalUserService],
})
export class NormalUserModule {}
