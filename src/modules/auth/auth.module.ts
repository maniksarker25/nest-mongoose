import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from 'src/modules/user/schemas/user.schema';
import { AuthController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    // Import User schema for auth
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Ensure env config is available
    ConfigModule,

    // Setup JWT via ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'), // OR 'jwt_access_secret'
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpiresIn'), // OR 'jwt_access_expires_in'
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // ✅ Export if needed in other modules
})
export class AuthModule {}
