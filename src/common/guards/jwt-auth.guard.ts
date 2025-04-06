import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/modules/user/services/user.service';
import { AppError } from '../errors/app-error';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModel,
} from 'src/modules/user/schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument> & UserModel,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization;

    if (!token) throw new UnauthorizedException('You are not authorized');

    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.access_secret'),
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError(HttpStatus.UNAUTHORIZED, 'Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new AppError(HttpStatus.UNAUTHORIZED, 'Invalid token');
      } else {
        console.error('Unexpected JWT error:', error);
        throw new AppError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Token verification failed',
        );
      }
    }

    if (!decoded) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'Token is expired');
    }

    const { id, iat } = decoded;

    const user = await this.userService.findOne(decoded.id);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.isVerified) throw new UnauthorizedException('Not verified');
    if (user.isBlocked) throw new UnauthorizedException('Blocked user');
    if (
      user?.passwordChangedAt &&
      (await this.userModel.isJWTIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat,
      ))
    ) {
      throw new AppError(
        HttpStatus.FORBIDDEN,
        'Token was issued before password change',
      );
    }
    req.user = decoded;
    return true;
  }
}
