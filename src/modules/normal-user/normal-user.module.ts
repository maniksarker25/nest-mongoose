import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NormalUser, NormalUserSchema } from './schemas/normal-user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NormalUser.name, schema: NormalUserSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class NormalUserModule {}
