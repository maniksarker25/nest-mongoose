import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { NormalUser } from 'src/modules/normal-user/schemas/normal-user.schema';
import { AppError } from 'src/common/errors/app-error';
import { EmailService } from 'src/common/utils/email/email.service';
import registrationSuccessEmailBody from 'src/common/utils/body/registrationSuccessEmailBody';
import { generateVerifyCode } from 'src/common/helpers/generateVerifyCode';
import { verifyCodeDto } from '../dtos/verify-code.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtDecodedUser } from 'src/common/interfaces/jwt-decoded-user.interface';
import { USER_ROLE } from '../interfaces/user-role.type';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(NormalUser.name) private normalUserModel: Model<NormalUser>,
    private readonly emailService: EmailService,
  ) {}

  // register user -------------
  async registerUser(dto: RegisterUserDto): Promise<NormalUser | undefined> {
    const { email, password, confirmPassword, ...userData } = dto;
    if (password !== confirmPassword) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Password and confirm password doesn't match",
      );
    }
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'This email already exists');
    }
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const verifyCode = generateVerifyCode();
      const userDataPayload = {
        email,
        password,
        role: 'user',
        verifyCode,
        codeExpireIn: new Date(Date.now() + 2 * 60000),
      };

      const user = await this.userModel.create([userDataPayload], { session });
      const normalUserPayload = {
        ...userData,
        user: user[0]._id,
      };

      const result = await this.normalUserModel.create([normalUserPayload], {
        session,
      });

      await this.userModel.findByIdAndUpdate(
        user[0]._id,
        { profileId: result[0]._id },
        { new: true, runValidators: true, session },
      );

      this.emailService.sendEmail({
        email,
        subject: 'Activate Your Account',
        html: registrationSuccessEmailBody(result[0].name, user[0].verifyCode),
      });

      await session.commitTransaction();
      session.endSession();
      return result[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Transaction failed',
      );
    }
  }

  // verify email with code
  async verifyCode(dto: verifyCodeDto) {
    const { email, code } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'User not found');
    }
    if (user.codeExpireIn < new Date(Date.now())) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'This code is expired , please resend verify code',
      );
    }
    if (user.verifyCode != code) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Code not matched');
    }
    const result = await this.userModel.findOneAndUpdate(
      { email: dto.email },
      { isVerified: true },
      { new: true, runValidators: true },
    );

    return result;
  }

  async getMyProfile(userData: JwtDecodedUser) {
    if (userData?.role == USER_ROLE.user) {
      return this.normalUserModel.findById(userData.profileId);
    } else if (1 == 1) {
      console.log('super admin is waiting');
    }
  }

  // get all user -------------------
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // get single user ------------------
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // update user ------------------------
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // delete user ---------------
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('User not found');
  }

  


  // crone jobs ------------------------------------
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleUnverifiedUserCleanup() {
    const now = new Date();
    const result = await this.userModel.deleteMany({
      isVerified: false,
      codeExpireIn: { $lt: now },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Deleted ${result.deletedCount} unverified users`);
    }
  }
}
