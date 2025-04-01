import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';
import { JwtDecodedUser } from 'src/common/interfaces/jwt-decoded-user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // login ------------------------
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    if (user.isDeleted) throw new ForbiddenException('User deleted');
    if (user.isBlocked) throw new ForbiddenException('User blocked');
    if (!user.isVerified)
      throw new ForbiddenException('Please verify your email');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect password');

    return this.generateTokens(user);
  }

  // change password ---------------------
  async changePassword(
    userData: JwtDecodedUser,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userData.id);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new ForbiddenException('Old password is incorrect');

    user.password = await bcrypt.hash(
      newPassword,
      +this.config.get('bcrypt_salt_rounds'),
    );
    user.passwordChangedAt = new Date();
    await user.save();
  }

  // refresh token--------------------

  async refreshToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: this.config.get('jwt_refresh_secret'),
    }) as JwtDecodedUser;

    const user = await this.userModel.findById(decoded.id);
    if (!user) throw new NotFoundException('User not found');

    return this.generateTokens(user);
  }

  // reset password ----------------
  async resetPassword(email: string, newPassword: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    user.password = await bcrypt.hash(
      newPassword,
      +this.config.get('bcrypt_salt_rounds'),
    );
    await user.save();
  }

  // generate rokens ---------------------------
  private generateTokens(user: UserDocument) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt_access_secret'),
      expiresIn: this.config.get('jwt_access_expires_in'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('jwt_refresh_secret'),
      expiresIn: this.config.get('jwt_refresh_expires_in'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
