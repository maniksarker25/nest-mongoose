import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdmin, SuperAdminSchema } from './schemas/super-admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuperAdmin.name, schema: SuperAdminSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class SuperAdminModule {}
