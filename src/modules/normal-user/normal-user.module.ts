import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NormalUser, NormalUserSchema } from './schemas/normal-user.schema';
import { NormalUserController } from './controllers/normal-user.controller';
import { NormalUserService } from './services/normal-user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NormalUser.name, schema: NormalUserSchema },
    ]),
    AuthModule,
    forwardRef(() => UserModule),
  ],
  controllers: [NormalUserController],
  providers: [NormalUserService, JwtAuthGuard, RolesGuard],
  exports: [NormalUserService, MongooseModule],
})
export class NormalUserModule {}
