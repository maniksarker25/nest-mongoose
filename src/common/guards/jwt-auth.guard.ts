import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization;

    if (!token) throw new UnauthorizedException('You are not authorized');

    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.access_secret'),
      });

      const user = await this.userService.findOne(decoded.id);
      if (!user) throw new UnauthorizedException('User not found');
      if (!user.isVerified) throw new UnauthorizedException('Not verified');
      if (user.isBlocked) throw new UnauthorizedException('Blocked user');
      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
