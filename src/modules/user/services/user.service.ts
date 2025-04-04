import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { NormalUser } from 'src/modules/normal-user/schemas/normal-user.schema';
import { AppError } from 'src/common/errors/app-error';
import { EmailService } from 'src/common/utils/email/email.service';
import registrationSuccessEmailBody from 'src/common/utils/body/registrationSuccessEmailBody';
import { generateVerifyCode } from 'src/common/helpers/generateVerifyCode';

// import { EmailService } from 'src/utils/sendEmail';

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
      console.error('Error during transaction:', error); // Log the error
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Transaction failed',
      );
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
}
