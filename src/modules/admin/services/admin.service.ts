import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { AppError } from 'src/common/errors/app-error';
import { User } from 'src/modules/user/schemas/user.schema';
import { USER_ROLE } from 'src/modules/user/interfaces/user-role.type';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // create admin into db -------------
  async createAdminIntoDb(dto: CreateAdminDto) {
    const { password, confirmPassword, ...adminData } = dto;
    if (dto.password != dto.confirmPassword) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Password and confirm password do not match',
      );
    }

    const isExists = await this.userModel.findOne({ email: dto.email });
    if (!isExists) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'This email already exist');
    }

    const session = await this.adminModel.db.startSession();
    session.startTransaction();

    try {
      const userDataPayload = {
        email: dto.email,
        password: dto.password,
        role: USER_ROLE.admin,
        isVerified: true,
      };

      const user = await this.userModel.create([userDataPayload], { session });
      const adminDataPayload = {
        ...adminData,
        user: user[0]._id,
      };
      const result = await this.adminModel.create([adminDataPayload], {
        session,
      });
      await this.userModel.findByIdAndUpdate(
        user[0]._id,
        { profileId: result[0]._id },
        { new: true, runValidators: true, session },
      );

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
}
